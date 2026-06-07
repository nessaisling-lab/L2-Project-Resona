# Resona — decision log (ADRs)

Why the project is the way it is. Captures reasoning made during planning that
isn't obvious from the code. Add new entries; don't silently reverse old ones.

## ADR-001 — Privacy-first, local by default
The core product runs entirely on-device: transcription, grammar, no account,
offline. Audio never leaves the device. This supersedes the original PRD's
cloud-first framing. Cloud is only ever an opt-in Pro layer, gated server-side.
Rationale: privacy is the product's wedge and its brand promise.

## ADR-002 — Native (Tauri 2) for the product; PWA as prototype only
We first built an in-browser PWA (Transformers.js, Whisper via WebGPU/WASM) to
validate UX fast — it's in `prototype-web/`. The shipping product is native
Tauri 2 because it gives one codebase for desktop now + mobile later, real
on-device performance, and access to larger models. The PWA is reference, not the
product.

## ADR-003 — Engine: Whisper via whisper.cpp (whisper-rs)
Chosen over English-accuracy leaders (NVIDIA Canary-Qwen, IBM Granite) because
multilingual matters (incl. Japanese), Whisper is MIT-licensed, and its ecosystem
is the largest. Target model: large-v3-turbo; tiny/base for mobile/free. whisper-rs
0.16 confirmed API. See MARKET.md for the alternatives we weighed.

## ADR-004 — Live streaming: energy VAD now, upgrade later
Current approach: cpal capture → energy/RMS VAD → emit `transcript://partial`
every ~700ms while speaking, `transcript://final` on ~800ms silence. Known upgrade
path: reuse one WhisperState (cheaper), overlapping-window "LocalAgreement"
decoding for smoother partials, swap energy VAD → whisper-rs built-in VAD or Silero,
use `rubato` for higher-quality resampling, and set a no-speech threshold to curb
Whisper's tendency to hallucinate on silence.

## ADR-005 — Freemium gating is server-side for anything that costs money
Client-side gating (model allow-list, length caps in `licensing.rs`) is UX only and
is trivially bypassable on a desktop — that's acceptable for *local* features.
Anything that costs us money (cloud LLM, hosted inference) MUST be enforced
server-side behind an authenticated entitlement. Issue a signed (Ed25519) license
token from the billing backend after hosted Stripe/Paddle checkout. The app never
handles card data and never ships an API key.

## ADR-006 — Visual language: Deep Current (dark-first)
Chose the **Deep Current** direction (deep-ocean dark mode, mint/teal accents,
leaf-and-soundwave mark) from three mockups in `design/mockups/`. Dark is the signature
expression; a light parity theme ships for Light Mode and accessibility. Supersedes the
earlier dark-gold / Georgia-serif / resonance-ring direction. Tokens locked in DESIGN.md;
assets in /brand. Visual language owner: Jimmy Ong.
