//! Thin wrapper over whisper-rs (bindings to whisper.cpp).
use anyhow::{anyhow, Result};
use whisper_rs::{FullParams, SamplingStrategy, WhisperContext, WhisperContextParameters};

pub struct WhisperEngine {
    ctx: WhisperContext,
}

impl WhisperEngine {
    /// Load a ggml/gguf model file (e.g. ggml-base.bin) from disk.
    pub fn load(model_path: &str) -> Result<Self> {
        let ctx = WhisperContext::new_with_params(model_path, WhisperContextParameters::default())
            .map_err(|e| anyhow!("failed to load model {model_path}: {e:?}"))?;
        Ok(Self { ctx })
    }

    /// Transcribe a buffer of 16kHz mono f32 samples.
    /// `single_segment` = true is used for low-latency streaming partials.
    pub fn transcribe(
        &self,
        audio: &[f32],
        language: Option<&str>,
        translate: bool,
        single_segment: bool,
    ) -> Result<String> {
        let mut params = FullParams::new(SamplingStrategy::Greedy { best_of: 1 });
        // Quiet logging — we want the text, not whisper.cpp's stdout chatter.
        params.set_print_special(false);
        params.set_print_progress(false);
        params.set_print_realtime(false);
        params.set_print_timestamps(false);
        params.set_suppress_blank(true);
        params.set_translate(translate);
        params.set_single_segment(single_segment);
        if let Some(lang) = language {
            params.set_language(Some(lang));
        }
        // Use available CPU threads; cap to a sane number.
        let threads = std::thread::available_parallelism()
            .map(|n| n.get() as i32)
            .unwrap_or(4)
            .min(8);
        params.set_n_threads(threads);

        let mut state = self
            .ctx
            .create_state()
            .map_err(|e| anyhow!("create_state failed: {e:?}"))?;
        state
            .full(params, audio)
            .map_err(|e| anyhow!("inference failed: {e:?}"))?;

        // whisper-rs 0.16: `full_n_segments` returns a plain count, and segment
        // text comes via `get_segment(i) -> Option<WhisperSegment>` + `to_str()`
        // (the old flat `full_get_segment_text` was removed).
        let n = state.full_n_segments();
        let mut out = String::new();
        for i in 0..n {
            if let Some(seg) = state.get_segment(i) {
                if let Ok(text) = seg.to_str() {
                    out.push_str(text);
                }
            }
        }
        Ok(out.trim().to_string())
    }
}

// SAFETY: whisper.cpp's context is internally synchronized for our usage pattern
// (one inference at a time, guarded by an Arc + the streaming consumer thread).
unsafe impl Send for WhisperEngine {}
unsafe impl Sync for WhisperEngine {}

#[cfg(test)]
mod tests {
    use super::*;

    /// End-to-end transcription against a real model + audio clip. Env-gated so it
    /// only runs when both binaries are available (they're not committed):
    ///   RESONA_TEST_MODEL = path to a ggml model (e.g. ggml-base.bin)
    ///   RESONA_TEST_AUDIO = path to a 16kHz mono WAV (e.g. whisper.cpp's jfk.wav)
    /// Exercises the whole pipeline: load -> whisper inference -> 0.16 segment API.
    #[test]
    fn transcribes_sample_clip() {
        let (model, audio) =
            match (std::env::var("RESONA_TEST_MODEL"), std::env::var("RESONA_TEST_AUDIO")) {
                (Ok(m), Ok(a)) => (m, a),
                _ => {
                    eprintln!("skipping: set RESONA_TEST_MODEL and RESONA_TEST_AUDIO to run");
                    return;
                }
            };

        // Decode the WAV to 16kHz mono f32 — the format whisper requires.
        let mut reader = hound::WavReader::open(&audio).expect("open test wav");
        let spec = reader.spec();
        let channels = spec.channels as usize;
        let raw: Vec<f32> = match spec.sample_format {
            hound::SampleFormat::Int => reader
                .samples::<i32>()
                .map(|s| s.unwrap() as f32 / (1i64 << (spec.bits_per_sample - 1)) as f32)
                .collect(),
            hound::SampleFormat::Float => reader.samples::<f32>().map(|s| s.unwrap()).collect(),
        };
        let samples: Vec<f32> = if channels <= 1 {
            raw
        } else {
            raw.chunks(channels)
                .map(|f| f.iter().copied().sum::<f32>() / channels as f32)
                .collect()
        };
        assert_eq!(spec.sample_rate, 16_000, "test clip must be 16kHz");
        assert!(!samples.is_empty(), "decoded no samples from {audio}");

        let engine = WhisperEngine::load(&model).expect("load model");
        let text = engine
            .transcribe(&samples, Some("en"), false, false)
            .expect("transcription failed");
        eprintln!("transcript: {text:?}");

        assert!(!text.trim().is_empty(), "expected a non-empty transcript");
        // jfk.wav: "...ask not what your country can do for you..."
        let low = text.to_lowercase();
        assert!(
            low.contains("country") || low.contains("fellow") || low.contains("americans"),
            "expected JFK keywords, got: {text:?}"
        );
    }
}
