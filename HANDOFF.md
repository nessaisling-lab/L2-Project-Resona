# Resona — Claude Code handoff

Everything needed to continue building Resona in Claude Code. Open this folder
in Claude Code and it will load `CLAUDE.md` automatically.

## What's inside
```
resona/
├── HANDOFF.md            ← you are here
├── CLAUDE.md             ← agent memory (read on launch): stack, gotchas, build order
├── docs/
│   ├── PRD.md            ← source of truth: scope, brand, monetization, §14 build priority
│   ├── DECISIONS.md      ← decision log (ADRs): why the architecture is what it is
│   ├── NAMING.md         ← brand rationale + trademark/verification homework
│   └── MARKET.md         ← model + competitor landscape
│   ├── CLAUDE_CODE_KICKOFF.md  ← paste-into-Claude-Code prompt
│   └── Resona_PRD_NetNewBuild.docx ← filled Pursuit PRD (class submission)
├── brand/                ← logo assets (wordmark, app mark + reversed, hero)
├── src/                  ← React + TypeScript frontend (Tauri app)
├── src-tauri/            ← Rust backend (whisper-rs, cpal, streaming, licensing)
└── prototype-web/        ← v1 in-browser PWA (Transformers.js) — UX reference only
```

## Start in Claude Code
A ready-to-paste kickoff prompt lives in `docs/CLAUDE_CODE_KICKOFF.md` (creates the public repo, adds Jimmy, starts the build).

```
# install Claude Code (native installer, recommended):
curl -fsSL https://claude.ai/install.sh | bash    # macOS/Linux
# then:
cd resona
claude
```

First prompt to give it:
> Read CLAUDE.md and docs/PRD.md. Start at PRD §14 P0: get a clean build
> (`cargo build` in src-tauri, `npm run build`), then fix any whisper-rs 0.16 /
> cpal 0.15 / Tauri 2 API drift. Small commits; tell me what you verified vs assumed.

## Core principle (decided)
Resona is **privacy-first, always** (PRD §3). The core product is fully local —
on-device transcription and grammar, no account, works offline, audio never leaves
the device. Cloud is never required; Pro *may* add optional, opt-in cloud AI gated
server-side. Any feature that sends audio off-device or requires an account for core
voice-to-text is out of scope. Don't reintroduce the PRD's old cloud-first framing.

## Prerequisites for the build
Rust, Node 18+, cmake (whisper.cpp builds from source), Tauri 2 system deps, and a
ggml Whisper model file (e.g. ggml-base.bin) downloaded locally.

## Contributors & git attribution
- **Aisling Leiva** — primary builder · <aisling.ld@pursuit.org>
- **Jimmy Ong** — product & PRD · <jimmy.ong@pursuit.org>

These emails are connected to our GitHub accounts. So commits land under the right
identity, each of us sets the git author on our own machine before committing:
```
# Aisling
git config user.name "Aisling Leiva" && git config user.email "aisling.ld@pursuit.org"
# Jimmy
git config user.name "Jimmy Ong" && git config user.email "jimmy.ong@pursuit.org"
```
For pair/co-authored commits, add a trailer in the commit message:
`Co-authored-by: Jimmy Ong <jimmy.ong@pursuit.org>`. A `.mailmap` is included so
GitHub/`git shortlog` group commits under the canonical names.
