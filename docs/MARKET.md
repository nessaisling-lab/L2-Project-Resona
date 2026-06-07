# Resona — market & model landscape

Snapshot from planning research (mid-2026). Re-verify leaderboards before any
big model/architecture decision — this space moves monthly.

## Speech-to-text models
- **Whisper** — best for multilingual (99+ langs), MIT, largest ecosystem. No longer
  the top English-WER model, but multilingual + license + tooling win for us.
  Targets: large-v3-turbo (quality), tiny/base (mobile/free).
- **English-accuracy leaders** — NVIDIA Canary-Qwen, IBM Granite Speech, Qwen3-ASR
  (lower WER on English). Considered, not chosen (English-only / heavier).
- **Low-latency streaming** — NVIDIA Parakeet TDT, Distil-Whisper.
- **Edge / smallest footprint** — Moonshine.
- **Runtimes** — faster-whisper (Python/CTranslate2); Transformers.js (in-browser,
  WebGPU/WASM) — the latter powers our PWA prototype.
- **Speaker diarization** (future "speaker detection") — WhisperX or pyannote.

## Competitors / positioning
Cloud transcription & dictation: Otter.ai, Deepgram, AssemblyAI, Gladia,
Speechmatics, Google/Azure STT. Local dictation apps: Wispr Flow, Superwhisper,
MacWhisper, VoiceInk.

**Resona's wedge:** fully on-device + private (no account, offline) *and* a grammar
/ refine pass — most competitors are cloud-based and/or transcription-only. Privacy +
polish is the differentiator; lead with it.
