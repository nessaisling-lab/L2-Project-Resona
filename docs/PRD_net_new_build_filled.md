# RESONA

**Product Requirements Document: Net New Build**

**Build name:** Resona — private voice-to-text
**Owner:** Aisling Leiva (build) · Jimmy Ong (product)
**Date:** June 8, 2026

> Mirrors the Pursuit "Net New Build" PRD template exactly. The submittable Word
> version is `Resona_PRD_NetNewBuild_filled.docx` in this folder.

---

## 1. PROBLEM

Professionals, students, and non-native English speakers experience clean writing taking as long to edit as it would to type, during everyday dictation, because speech-to-text output is messy (filler words, missing punctuation, run-ons) and the popular tools stream audio to the cloud — resulting in wasted time and a privacy trade-off they can't accept. People speak three to four times faster than they type, but messy transcripts and cloud dependence erase that advantage.

### Supporting Context (optional)

- People speak ~150 wpm but type ~40 wpm; editing a messy transcript erases much of that 3–4x speed advantage.
- Mainstream dictation and transcription tools send audio off-device, ruling them out for legal, medical, journalistic, and other privacy-sensitive work.
- Whisper (OpenAI, MIT-licensed) now runs fast enough on-device via whisper.cpp for accurate local transcription on ordinary consumer hardware.

## 1a. Opportunity

If transcription and cleanup run entirely on-device, Resona offers the speed of dictation with the polish of a writing assistant and a privacy guarantee no cloud tool can match — opening the privacy-sensitive segment cloud tools can't serve, with no per-minute cloud cost on the free tier.

### Market Opportunity

- Speech-to-text / transcription is a multi-billion-dollar market growing double digits year over year.
- Differentiator: no mainstream tool pairs on-device Whisper transcription with on-device grammar cleanup and a hard "audio never leaves your device" promise.

## 1b. Users & Needs

**Primary user(s):** Professionals and non-native English speakers who need to communicate clearly, quickly, and privately — emails, reports, meeting notes.

**Secondary users:** Students (essays, notes) and content creators (scripts, blogs, social). Privacy-sensitive users across all groups are the sharpest wedge.

### Key User Needs

- As a professional, I need to turn speech into clean, ready-to-send text without a manual editing pass, because editing erases the speed I gained by dictating.
- As a privacy-sensitive user, I need transcription and grammar to run on my own device with no account, because my audio cannot be sent to someone else's servers.

## 2. PROPOSED SOLUTION

Resona is a privacy-first desktop app (Tauri 2, Rust, React) that transcribes live dictation and uploaded files locally with Whisper (whisper.cpp), applies a local grammar and filler-word cleanup pass, shows a writing score, and exports clean text — with no account and no network. Optional cloud AI (advanced rewrite and tone) is an opt-in Pro upgrade enforced server-side; it is never required and never the default.

## 2a. Value Proposition

Professionals and privacy-sensitive speakers who struggle with messy, cloud-dependent dictation use Resona, an on-device voice-to-text app that turns speech into polished, ready-to-send text without the audio ever leaving their machine. Voice to text, that stays yours.

## 2b. Top 3 MVP Value Props

- **The Vitamin (must-have baseline):** Accurate speech-to-text for both live dictation and uploaded files, running on-device.
- **The Painkiller (solves the core pain):** Automatic grammar, punctuation, and filler-word cleanup, so the output is ready to send, not raw.
- **The Steroid (the magic moment):** It all runs locally — your audio never leaves your device, no account, works offline.

## 2c. Goals & Non-Goals

### Goals

- Ship a free, fully-local MVP: live + file transcription, local grammar and filler removal, and copy/export.
- Honor the privacy promise in code — no audio off-device, no account for core use, works offline.
- Reduce the manual editing users do after dictation to near zero.

### Non-Goals

- Cloud AI rewrite/tone, AI writing score, accounts, and Team workspace — these are Pro/later and gated server-side.
- Speaker diarization, templates, third-party integrations, browser extension, and mobile apps — all post-MVP.

## 2d. Success Metrics

| Goal | Signal | Metric | Target |
| --- | --- | --- | --- |
| Ship a usable local MVP | User completes transcribe → clean → export unaided | Task completion in user testing | ≥ 90% of testers finish without help |
| Cut post-dictation editing | User sends text with few manual edits | Edits per 100 words vs raw STT | ≥ 50% fewer edits than raw transcript |
| Keep it private | No audio leaves the device (free tier) | Audio bytes sent off-device (free) | 0 bytes |
| Responsive live dictation | User keeps dictating without lag | Partial-update latency (off UI thread) | Real-time feel on base model (directional) |
| Users value it | Users return and recommend | Satisfaction score | > 4.5 / 5 |

## 3. REQUIREMENTS

### User Journey 1: Professional turns a recording into clean text (file transcription)

**Context:** The wedge use case — turn an existing audio/video file into polished text, fully offline. Optimizing for "drop a file in, get clean text out."

**Sub-journey: Load a Whisper model**
- **[P0]** User can pick a model size (tiny/base) and load a local ggml model file.
- **[P0]** User can see clear load status: loading, ready, or a helpful error.
- **[P0]** User can use the app fully offline, with no account or sign-in.
- **[P1]** User can choose the language (including Japanese) or let it auto-detect.
- **[P2]** User can switch to a larger, more accurate model (Pro).

**Sub-journey: Transcribe a file**
- **[P0]** User can upload an audio or video file from their device.
- **[P0]** User can watch the transcript appear, produced entirely on-device.
- **[P1]** User can transcribe long recordings (length limits apply on the free tier).
- **[P2]** User can translate non-English speech to English (Pro).

**Sub-journey: Review, clean up, and export**
- **[P0]** User can run the local grammar review and apply the suggested fixes.
- **[P0]** User can copy the text or export it as txt/md, saved locally on-device.
- **[P1]** User can remove filler words and see a writing-score breakdown.

### User Journey 2: Anyone dictates live and gets polished text (live dictation)

**Context:** Real-time capture for quick, private dictation. Optimizing for low-friction "speak, get clean text."

**Sub-journey: Dictate in real time**
- **[P0]** User can start live dictation from the microphone, captured on-device.
- **[P0]** User can see partial text while speaking and finalized lines on each pause.
- **[P1]** User can see a recording status cue that does not rely on color alone.
- **[P2]** User can dictate in another language (including Japanese).

**Sub-journey: Refine and reuse**
- **[P0]** User can stop dictation, run the grammar review, and apply fixes.
- **[P0]** User can copy or export the result locally (txt/md).
- **[P1]** User can remove fillers and see the writing score.

## 4. APPENDIX

- **Repository:** github.com/nessaisling-lab/L2-Project-Resona
- **Tech stack:** Tauri 2 shell, Rust backend (whisper-rs / whisper.cpp, cpal), React + TypeScript frontend; in-browser PWA prototype (Transformers.js) as UX reference.
- **Design language:** "Deep Current" (dark-first), built to WCAG AA + Apple HIG — see docs/DESIGN.md.
- **Key decisions:** ADR-001 privacy-first / local by default; ADR-003 Whisper via whisper.cpp; ADR-005 server-side gating for anything that costs money — see docs/DECISIONS.md.
- **Monetization:** Free (fully local, no account) · Pro $12/mo (opt-in cloud AI, enforced server-side) · Team $25/user/mo.
- **Open questions:** free-tier limit (30 min/month vs per-file cap); offline Pro (local small LLM) vs online Pro (cloud LLM); if online Pro, which provider and per-user cost ceiling.
