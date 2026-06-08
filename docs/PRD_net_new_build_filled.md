# Resona

**Product Requirements Document: Net New Build**

**Build name:** Resona — private voice-to-text
**Owner:** Aisling Leiva (build) · Jimmy Ong (product)
**Date:** June 8, 2026

---

## 1. PROBLEM

People speak three to four times faster than they type, but raw speech-to-text arrives full of filler words, missing punctuation, run-ons, and grammar mistakes — so users spend nearly as long editing as they saved. Worse, the popular dictation and transcription tools are cloud-first: your audio is streamed to someone else's servers, which is a non-starter for anyone handling private, sensitive, or regulated speech.

*Professionals, students, and non-native English speakers experience clean writing taking as long to edit as it would to type, during everyday dictation, because speech-to-text output is messy and must be sent to the cloud, resulting in wasted time and a privacy trade-off they can't accept.*

### Supporting Context (optional)

- People speak ~150 wpm but type ~40 wpm; editing a messy transcript erases much of that 3–4x speed advantage.
- Mainstream dictation/transcription tools send audio off-device, ruling them out for legal, medical, journalistic, and other privacy-sensitive work.
- Whisper (OpenAI, MIT-licensed) now runs fast enough on-device via whisper.cpp to make fully local, accurate transcription viable on ordinary consumer hardware.

## 1a. Opportunity

If transcription and cleanup happen entirely on-device, Resona can offer the speed of dictation with the polish of a writing assistant and a privacy guarantee no cloud tool can match: your audio never leaves your device. That opens the privacy-sensitive segment cloud tools can't serve, and removes per-minute cloud costs from the free tier so the local product can scale for free.

### Market Opportunity

- Speech-to-text / transcription is a multi-billion-dollar category growing double digits year over year.
- No mainstream product pairs on-device Whisper transcription with on-device grammar cleanup and a hard "audio never leaves your device" promise — that gap is Resona's wedge.

## 1b. Users & Needs

**Primary user(s):** Professionals (emails, reports, meeting notes) and non-native English speakers who need to communicate clearly, quickly, and privately.

**Secondary user(s):** Students (essays, notes) and content creators (scripts, blogs, social). Privacy-sensitive users across all groups are the sharpest wedge.

### Key User Needs

- Turn speech into clean, ready-to-send text without a manual editing pass.
- Keep audio and transcripts on their own device — no account, works offline.
- Handle both live dictation and uploaded files, with grammar and filler-word cleanup applied automatically.

## 2. PROPOSED SOLUTION

Resona is a privacy-first, on-device voice-to-text desktop app (Tauri 2 · Rust · React). It transcribes live dictation and uploaded files locally with Whisper (whisper.cpp), applies a local grammar and filler-word cleanup pass, surfaces a writing score, and exports clean text — all with no account and no network. Optional cloud AI (advanced rewrite and tone) is an opt-in Pro upgrade enforced server-side; it is never required and never the default.

## 2a. Value Proposition

**Voice to text, that stays yours.** Speak naturally and get polished, professional text in seconds — transcription, grammar cleanup, and filler removal that run entirely on your device. On-device · works offline · no account needed.

## 2b. Top 3 MVP Value Props

1. **Private by default.** Transcription and grammar run on-device; audio never leaves the machine, no account, works offline. This is the differentiator cloud tools structurally can't copy.
2. **Speech in, clean text out.** Local Whisper transcription plus an automatic grammar, punctuation, and filler-word pass — output is ready to send, not raw.
3. **One tool for live and files.** Dictate in real time or drop in an audio/video file, review the writing score, apply fixes, then copy or export (txt/md).

## 2c. Goals & Non-Goals

### Goals

- Ship a free, fully-local MVP: voice recording, Whisper file + live transcription, local grammar + filler removal, copy/export (txt/md), Resona branding in-app.
- Honor the privacy promise in code: no audio off-device, no account for core use, works offline.
- Run cross-platform on one codebase (macOS / Windows / Linux now; mobile later).

### Non-Goals

- Cloud AI rewrite/tone, AI writing score, accounts, and Team workspace — these are Pro/later and gated server-side.
- Speaker diarization, templates, third-party integrations, browser extension, and mobile apps (post-MVP).
- Handling card/payment data in the app — billing runs through hosted Stripe/Paddle.

## 2d. Success Metrics

| Metric | Baseline | Target |
| --- | --- | --- |
| Transcription accuracy (WER), on-device | New product | Competitive with Whisper base/small on-device; measured per model |
| Manual editing reduction vs raw STT | Raw transcript needs heavy edits | Meaningful, measurable drop in edits before text is "ready to send" |
| Live dictation latency | New product | Responsive partials kept off the UI thread (directional; varies by model/device) |
| Privacy guarantee | New product | 100% of core transcription + grammar runs on-device; 0 audio bytes leave the device on the free tier |
| User satisfaction | New product | > 4.5 / 5 |

*Note: the original "<2s latency / 95% accuracy" targets are model- and device-dependent on-device, so we treat them as directional and measure per model.*

## 3. REQUIREMENTS

### User Journey 1: Professional cleans up a recorded note (file transcription)

**Context:** The wedge use case — turn an existing audio/video file into polished text, fully offline. Optimizing for "drop a file in, get clean text out."

**Sub-journey: Load a model**
- **[P0]** User can choose a Whisper model (tiny/base) and load a local ggml model file.
- **[P0]** User sees clear status: loading, ready, or a helpful error.

**Sub-journey: Transcribe a file**
- **[P0]** User can upload an audio/video file; it is decoded to 16kHz mono on-device.
- **[P0]** User can watch the transcript appear, produced entirely locally.
- **[P1]** User can choose the language (including Japanese) or let it auto-detect.

**Sub-journey: Clean up and export**
- **[P0]** User can run the local grammar review and Apply fixes.
- **[P0]** User can remove filler words and copy or export the text (txt/md, saved locally).
- **[P1]** User can see a writing score with a sub-metric breakdown.
- **[P2]** User can export to .docx (Pro).

### User Journey 2: Anyone dictates live and gets polished text (live dictation)

**Context:** Real-time capture for quick, private dictation. Optimizing for low-friction "speak → clean text."

**Sub-journey: Start dictation**
- **[P0]** User can start live dictation from the microphone (on-device capture).
- **[P0]** User can see partial text while speaking and finalized lines on pause.
- **[P1]** User sees a clear recording status cue that does not rely on color alone.

**Sub-journey: Refine and reuse**
- **[P0]** User can stop, run the grammar review, and apply fixes.
- **[P0]** User can copy or export the result locally.
- **[P1]** User can remove fillers and see the writing score.

## 4. APPENDIX

- **Repository:** github.com/nessaisling-lab/L2-Project-Resona
- **Tech stack:** Tauri 2 shell, Rust backend (whisper-rs / whisper.cpp, cpal), React + TypeScript frontend; an in-browser PWA prototype (Transformers.js) served as the UX reference.
- **Design language:** "Deep Current" (dark-first), built to WCAG AA + Apple HIG — see docs/DESIGN.md.
- **Key decisions:** ADR-001 privacy-first / local by default; ADR-003 Whisper via whisper.cpp; ADR-005 server-side gating for anything that costs money — see docs/DECISIONS.md.
- **Monetization:** Free (fully local, no account) · Pro $12/mo (opt-in cloud AI, enforced server-side) · Team $25/user/mo.
- **Open questions:** free-tier limit (30 min/month vs per-file cap); offline Pro (local small LLM, keeps the privacy promise) vs online Pro (cloud LLM); if online Pro, which provider and per-user cost ceiling.
