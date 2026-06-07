# Resona

Local-first, cross-platform **private voice-to-text**. Live dictation + file
transcription on-device, with a grammar review pass; freemium. Built as a
scaffold in chat; continuing here in Claude Code.

**Read `docs/PRD.md` first** — source of truth for scope, branding, monetization,
and the build order (§14). Also in `docs/`: `DECISIONS.md` (why the architecture is what it is), `NAMING.md` (brand + trademark homework), `MARKET.md` (model/competitor landscape), `DESIGN.md` (visual language + accessibility/HIG), `ROADMAP.md`, and `TODO.md`. This file is the engineering quick-reference.

## Brand (see /brand for assets)
- Name: **Resona**. Descriptor: **private voice-to-text**. Tagline: **"Voice to text, that stays yours."**
- Logo: a leaf containing a soundwave (also the standalone app mark).
- Palette: nature/ocean (leaf greens + ocean teals + sand accent); SF/system type; WCAG AA + Apple HIG. Full language in `docs/DESIGN.md` (owner: Jimmy Ong); direction locked: **Deep Current** (dark-first); tokens in `docs/DESIGN.md`, assets in `/brand`. Old gold/serif assets superseded.
- Positioning: privacy-first. Free tier is fully local/no-account; Pro adds optional cloud AI.

## WHAT (stack & architecture)
- **Shell:** Tauri 2 — macOS/Windows/Linux now, iOS/Android later.
- **Frontend:** React + TypeScript (Vite) in `src/`.
- **Backend:** Rust in `src-tauri/src/`:
  - `whisper.rs`  — `whisper-rs` (whisper.cpp): load model, transcribe a buffer.
  - `audio.rs`    — `cpal` mic capture → downmix mono → resample to **16kHz f32**.
  - `vad.rs`      — energy/RMS voice-activity detection.
  - `streaming.rs`— live loop: capture → VAD → incremental whisper → Tauri events
                    (`transcript://partial` while speaking, `transcript://final` on silence).
  - `licensing.rs`— `Tier` / `Entitlements` / demo license validation.
  - `lib.rs`      — Tauri commands, app state, tier gating. `main.rs` is thin.
- **Commands** via `@tauri-apps/api/core` `invoke`; **live results** via `@tauri-apps/api/event` `listen`.
  Files are decoded to 16kHz mono in the browser (Web Audio) and sent to Rust as `Vec<f32>`.
- **Reference prototype:** `prototype-web/index.html` — the v1 in-browser PWA (Transformers.js). Useful for UX reference; not the product.

## HOW (commands)
```
npm install
npm run tauri dev      # dev w/ hot reload
npm run tauri build    # platform bundles
cargo build            # (in src-tauri) compile-check Rust alone
```
Needs Rust, Node 18+, cmake (whisper.cpp builds from source), Tauri 2 system deps.
Download a ggml model (e.g. ggml-base.bin) and pass its path in the UI. For GPU
speed enable a whisper-rs backend feature in Cargo.toml (metal/cuda/vulkan).

## Current state
Structurally complete, **not yet compiled** — whisper-rs 0.16 / cpal 0.15 / Tauri 2
APIs may have drifted. First job is a clean build.

## Build order (primary builder: Aisling) — full detail in docs/PRD.md §14
- **P0:** green build → file transcription → live dictation → local grammar + export → brand in UI.
- **P1:** smooth live partials (reuse WhisperState / overlapping windows / built-in VAD), filler removal + writing-score scaffold, model+language pickers, docx export.
- **P2 (mostly partner):** Pro backend — server-side entitlement check + Stripe webhook + signed license token; cloud LLM rewrite/tone via backend.

## Gotchas (do not regress)
- Audio MUST be **16kHz mono f32** before whisper, or output is garbage.
- Run inference **off the UI thread** (it's on a consumer thread already).
- Streaming tuning in `streaming.rs`: `SPEECH_THRESHOLD`, `SILENCE_MS`, `PARTIAL_MS`.
- **Freemium security:** client-side gating is UX only and bypassable on desktop.
  Anything that costs money (cloud LLM, hosted inference) MUST be enforced
  server-side behind an authenticated API. Never ship an API key in the client.
- Billing = hosted Stripe/Paddle; the app never handles card data.

## Working agreement for the agent
- Make small, reviewable diffs. After Rust changes run `cargo build`; after frontend
  changes run `npm run build`; report what you verified vs. assumed.
- Don't add dependencies without noting why. Don't commit secrets or model binaries.
- When scope is unclear, check docs/PRD.md before inventing behavior.
