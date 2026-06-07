# Resona — Product Requirements Document

Authors: Aisling Leiva (primary builder) <aisling.ld@pursuit.org> · Jimmy Ong (product & PRD) <jimmy.ong@pursuit.org>  ·  Status: living draft
Source: merges the team PRD ("wk-1 day 2 project") with the locked brand and the local-first technical direction.

---

## 1. Product name

**Resona** — from the Latin *resonus* ("to resound"). Previously "undecided."

## 2. Brand & positioning

- **Logo:** a leaf containing a soundwave (nature + voice); detaches into a standalone app mark / favicon. Full design language in `docs/DESIGN.md`; visual language owned by Jimmy Ong.
- **Descriptor** (logo lockup, app store, meta title): **private voice-to-text**.
- **Campaign tagline** (hero): **"Voice to text, that stays yours."**
- **Hero subline:** "Live dictation and file transcription, polished for grammar. It all runs on your device — your audio never leaves it."
- **Proof line:** on-device · works offline · no account needed.
- **Visual language:** nature / ocean palette (leaf greens + ocean teals, sparing sand accent) on clean, accessible surfaces; SF / system typography; leaf-and-soundwave motif. Built to WCAG AA + Apple HIG. Direction: **Deep Current** (dark-first), chosen from `design/mockups/`; tokens locked in `docs/DESIGN.md`, assets in `/brand`. Supersedes the earlier dark-gold / Georgia-serif / resonance-ring direction.
- **Voice/tone:** calm, precise, privacy-forward. We state privacy three ways without nagging: category (descriptor), promise (tagline), proof (feature row).

## 3. Core principle — private by default (decided)

**Resona is privacy-first, always.** This is settled, not an open question. The original PRD's cloud-first framing (logins everywhere, Whisper API, cloud LLMs as the default) is superseded by this principle:

> **The core product is fully local and private** — on-device transcription and grammar, no account, works offline. Audio never leaves the device.
> **Cloud is never required to use Resona.** Pro *may* add optional cloud AI (tone rewrite, advanced suggestions) as an explicit, opt-in upgrade, gated **server-side** behind an authenticated entitlement.

Any feature that would send user audio off-device, or require an account to do core voice-to-text, is out of scope. The "no account needed / your audio never leaves it" promise on the homepage is a product commitment, not marketing copy — honor it in the code.

## 4. Vision

Let users speak naturally and instantly receive polished, grammatically correct text ready to send, publish, or save — combining speech-to-text transcription, grammar correction, and (Pro) AI rewriting/tone, with real-time assistance, all private by default.

## 5. Problem statement

People speak faster than they type, but speech-to-text output carries grammar mistakes, filler words, poor punctuation, and run-ons, forcing manual editing. Existing cloud tools also send your audio to someone else's servers. Resona converts speech to high-quality written text **on your device**.

## 6. Goals & success metrics

Primary goals: real-time transcription · automatic grammar correction · tone improvement (Pro) · export-ready content · privacy by default.

Success metrics: high transcription accuracy on supported models · low processing latency for live dictation · meaningful reduction in manual editing · healthy DAU · satisfaction > 4.5/5. (Note: original "<2s / 95%" targets are model- and device-dependent on-device; treat as directional, measure per model.)

## 7. Target users

Professionals (emails, reports, docs, meeting notes) · Students (essays, notes) · Content creators (blogs, scripts, social) · Non-native English speakers (professional communication, confidence). Privacy-sensitive users across all of the above are a wedge audience.

## 8. Core features

Tags: `[MVP]` first release · `[Pro]` paid/cloud · `[later]` post-MVP. Local unless marked cloud.

1. **Voice recording** `[MVP]` — start/pause/resume/stop, audio visualization, noise suppression. (Native mic via cpal.)
2. **Real-time transcription** `[MVP]` — live transcript, multi-language, timestamps. Speaker detection `[later]`. Engine: whisper.cpp (local). Cloud Whisper API optional `[Pro]`.
3. **Grammar correction** `[MVP]` — capitalization, punctuation, spelling, basic grammar. Local rule-based engine; deeper correction via LLM `[Pro]`.
4. **AI rewrite / tone** `[Pro]` — professional/casual/friendly/executive/academic/concise. Requires LLM (local small model offline, or cloud behind server gating).
5. **Remove filler words** `[MVP]` — um, uh, you know, like, basically. (Local rules.)
6. **Writing score** `[Pro]` — grammar/clarity/conciseness/readability/tone, 0–100.
7. **AI suggestions** `[Pro]` — shorter-sentence, vocabulary, passive-voice, repeated-word.
8. **Templates** `[later]` — email, meeting notes, blog, LinkedIn, essay, exec summary.
9. **Export** `[MVP]` txt/md, `[Pro]` docx/pdf/srt/vtt; integrations (Docs/Notion/Slack/Word) `[later]`.

## 9. User flow

Open app → record (or drop a file) → live transcript appears → local grammar fixes applied → (Pro) choose tone → (Pro) AI rewrite → export or copy.

## 10. Functional & non-functional requirements

- **Auth:** none for the free local tier. Account (email/Google) only for Pro/cloud features and Team. `[Pro]`
- **Dashboard / editor:** recent recordings, saved docs, writing score; rich-text editing, suggestions, undo/redo, version history.
- **Performance:** responsive live dictation (transcription off the UI thread); model choice trades speed vs. accuracy.
- **Security/privacy:** audio processed on-device by default; TLS for any cloud (Pro) calls; the cloud entitlement check and any LLM key live server-side, never in the client bundle. GDPR/SOC 2 apply to the cloud backend if/when built.
- **Scalability:** the local app scales trivially (runs on the user's machine); scale concerns apply only to the Pro backend.

## 11. AI architecture

Pipeline: audio → whisper.cpp STT (local) → raw transcript → local grammar engine → [Pro] LLM rewrite/score via backend → final output.
Models: speech = Whisper (large-v3-turbo target; tiny/base for free/mobile). Language (Pro) = Claude / GPT / Gemini via the Pro backend, or a small local LLM for offline Pro. Optional custom grammar model `[later]`.

## 12. Monetization

- **Free** — 30 min transcription/month, basic (local) grammar correction. No account.
- **Pro ($12/mo)** — unlimited transcription, AI rewrite, premium tones, writing score, advanced export.
- **Team ($25/user/mo)** — shared workspace, analytics, admin controls.

Gating: free/local limits are enforced client-side (UX only). All Pro/cloud features are enforced **server-side** behind an authenticated entitlement; billing via hosted Stripe/Paddle checkout (the app never handles card data).

## 13. MVP scope (first release)

Include: voice recording · local Whisper transcription (file + live) · local grammar correction · filler-word removal · copy/export (txt/md) · Resona branding in-app.
Exclude (for now): AI rewrite/score (Pro), accounts, team, mobile, browser extension, speaker diarization.

## 14. Build prioritization — primary builder: Aisling

Sequenced for a mostly-solo build. Owner tags: `[A]` Aisling, `[P]` partner/later.

- **P0 — get to a running branded app `[A]`**
  1. `cargo build` + `npm run tauri build` green; fix whisper-rs/cpal/Tauri API drift.
  2. File transcription path working end-to-end (decode → 16kHz mono → whisper-rs).
  3. Live dictation working (cpal → VAD → streaming partials/finals).
  4. Local grammar review wired to results; apply-fixes + export txt/md.
  5. Resona wordmark/app mark + brand colors in the UI.
- **P1 — refine & polish `[A]`**
  6. Smooth live partials (reuse one WhisperState; consider overlapping-window decoding; swap energy VAD → whisper-rs built-in VAD).
  7. Filler-word removal + writing-score scaffold (local heuristics first).
  8. Model picker + language picker (incl. Japanese); docx export.
- **P2 — Pro/cloud (mostly partner) `[P]`**
  9. Pro backend: authenticated entitlement check + Stripe webhook issuing a signed (Ed25519) license token. *This is what actually protects Pro revenue.*
  10. Cloud LLM rewrite/tone/suggestions routed through the backend (key server-side only).
- **Later `[P]`** — templates, integrations, mobile targets (`tauri ios/android init`), diarization, team.

## 15. Tech stack

Tauri 2 shell (macOS/Windows/Linux now; iOS/Android later) · React + TypeScript frontend · Rust backend · whisper.cpp via `whisper-rs` · `cpal` for capture · hosted Stripe/Paddle for billing · optional Pro backend for cloud LLM + entitlements. Reference prototype: in-browser PWA using Transformers.js (`/prototype-web`).

## 16. Roadmap

Phase 2: browser extension, inline suggestions. Phase 3: mobile iOS/Android. Phase 4: meeting assistant, live transcription, AI summaries. Phase 5: enterprise workspace, team knowledge base, writing standards.

## 17. Success criteria (directional)

Within 90 days of a public release: meaningful registered + weekly-active base, healthy free→paid conversion, NPS > 50. The product succeeds if users can speak naturally and get professional-quality written text with minimal editing — privately.

## 18. Open decisions for the team

Privacy-first is decided (§3). Remaining:

1. Free-tier limit: original PRD says 30 min/month; the scaffold currently caps per-file. Pick one model and align `licensing.rs`.
2. Do we ship an **offline** Pro (local small LLM, keeps the privacy promise even for Pro) or **online** Pro (cloud LLM)? Offline Pro is the more on-brand answer; online Pro is easier to ship. Affects §14 P2.
3. If/when online Pro: which provider for rewrite, and at what per-user cost ceiling?
