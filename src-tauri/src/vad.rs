//! Dependency-free energy (RMS) voice-activity detection.
//! For production, consider whisper-rs's built-in VAD (WhisperVadContext) or
//! the `webrtc-vad` / Silero models for far better silence handling.

/// Root-mean-square energy of a frame.
pub fn rms(frame: &[f32]) -> f32 {
    if frame.is_empty() {
        return 0.0;
    }
    let sum: f32 = frame.iter().map(|s| s * s).sum();
    (sum / frame.len() as f32).sqrt()
}

/// True if the frame's energy clears the speech threshold.
/// Typical threshold for a normal mic: ~0.01–0.02. Tune per device.
pub fn is_speech(frame: &[f32], threshold: f32) -> bool {
    rms(frame) > threshold
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rms_of_silence_is_zero() {
        assert_eq!(rms(&[]), 0.0);
        assert_eq!(rms(&[0.0; 480]), 0.0);
    }

    #[test]
    fn rms_of_constant_signal_is_its_magnitude() {
        // RMS of a constant ±a signal is |a|.
        assert!((rms(&[0.5; 100]) - 0.5).abs() < 1e-6);
        assert!((rms(&[-0.5; 100]) - 0.5).abs() < 1e-6);
    }

    #[test]
    fn speech_gate_separates_loud_from_quiet() {
        let thr = 0.015; // SPEECH_THRESHOLD used by streaming.rs
        let quiet = [0.001f32; 480]; // near-silent room tone
        let loud = [0.2f32; 480]; // clear speech-level energy
        assert!(!is_speech(&quiet, thr), "room tone must not register as speech");
        assert!(is_speech(&loud, thr), "speech-level energy must register");
        assert!(!is_speech(&[], thr), "empty frame is not speech");
    }
}
