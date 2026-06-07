# Claude Code — kickoff

Paste the block below into Claude Code (run it from an empty folder, with the
project `.zip` attached). It bootstraps the repo and starts the build.

---

```
Aisling Leiva (aisling.ld@pursuit.org) and Jimmy Ong (jimmy.ong@pursuit.org)
are going to work on a new Pursuit L2 project — Resona, a privacy-first,
on-device voice-to-text app that's a mix between Whisper and Grammarly.

I'm attaching a .zip that has all the docs and the scaffold needed to start
building. Please:

1. Unzip it into the project directory, then read these in order:
   HANDOFF.md -> CLAUDE.md -> docs/PRD.md (especially section 14, the build
   order) -> docs/DESIGN.md -> docs/DECISIONS.md.

2. Initialize git in the project root and make an initial commit of the
   scaffold (a .gitignore is already included).

3. Create a new GitHub repo named "L2 Project Resona", make it PUBLIC, and add
   my partner Jimmy Ong as a collaborator. Then push the initial commit.
   Ask me for Jimmy's GitHub username if you need it to add him.

4. Set my git identity for this repo: name "Aisling Leiva",
   email "aisling.ld@pursuit.org". A .mailmap is included; use a
   "Co-authored-by: Jimmy Ong <jimmy.ong@pursuit.org>" trailer on commits
   that include his work.

Then start building at PRD section 14, P0:
- Get a clean build — run `cargo build` in src-tauri and `npm run build`, and
  fix any whisper-rs 0.16 / cpal 0.15 / Tauri 2 API drift.
- Then proceed through P0: file transcription -> live dictation ->
  local grammar + export.
- Make small, reviewable commits, and after each step tell me what you
  verified versus assumed.

Guardrails: Resona is privacy-first and local by default — do not reintroduce
any cloud-first framing; cloud features are opt-in Pro only, gated server-side
(see DECISIONS.md ADR-001 and ADR-005). The visual language is "Deep Current"
(docs/DESIGN.md) — don't restyle without checking it first.
```

---

## Before you run this
- The repo is **public** (per the team's choice). The GitHub slug will be
  `L2-Project-Resona` (spaces become hyphens); the display name still reads fine.
- Adding Jimmy as a collaborator via the `gh` CLI needs his **GitHub username**,
  not his email — have it ready, since the prompt tells Claude Code to ask.
- Claude Code needs `git` installed and the GitHub CLI authenticated
  (`gh auth login`) before it can create the repo and add a collaborator.
- For commits to link to your profiles, `aisling.ld@pursuit.org` and
  `jimmy.ong@pursuit.org` must each be added and verified in your GitHub email
  settings.
- First real coding task is PRD section 14, P0 #1: a clean build + reconciling
  any whisper-rs / cpal / Tauri API drift (the scaffold hasn't been compiled).
