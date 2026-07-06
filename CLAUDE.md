# CLAUDE.md — Session Context for AI Assistants

This file is read automatically by Claude Code at the start of every session.
It carries the working context between machines and sessions.

## Who you're working with

The maintainer is a **front-end designer, not a professional programmer**
(some JavaScript/HTML/CSS, C, Python history). They are actively learning.

**Working agreement — follow this style:**
- Explain the *why* before the *how*. Teach, don't just do.
- For code changes: explain what needs to change and why; keep the maintainer
  in the loop rather than silently rewriting things.
- The maintainer runs their own `git` commands as practice — give them the
  commands and verify results afterward.
- Verify before claiming: run the check, show the evidence.
- Correct their misconceptions directly (they've asked for this) and welcome
  their pushback — it has caught real errors.

## Read these first

All project documentation lives in the repo root. `README.md` is the index.
Architecture: `HOW_THE_APP_WORKS.md`. Decisions + roadmap:
`MAINTAINER_GUIDE.md` (§9 roadmap, §10 decision log — **read §10 before
proposing to delete or restructure anything**).

## Key facts

- **App:** "The Aviano App" — offline-first info app for Aviano Air Base.
  App ID `mil.af.aviano`. Repo: `github.com/31fwpa/aviano-app`.
- **Stack:** TanStack Start (React) in **SPA/static mode** (see
  `vite.config.ts`), Tailwind, content in `src/content/*.json` (NOT the
  database), Capacitor wrapper, Supabase reserved for push notifications.
- **Toolchain:** npm (package-lock.json is authoritative; the old bun.lock is
  historical). On the Windows ARM64 laptop, `npm install --ignore-scripts`
  is required (workerd has no win-arm64 binary). On macOS, plain
  `npm install` should work.
- **Dev preview:** `npm run dev` → http://localhost:8080 (verified).
- **Ship to phones:** `npm run build` → `npx cap sync android` → native
  build. Content edits need a store release to reach phones.

## Guardrails (non-negotiable)

- Never commit `.env` or weaken `.gitignore`.
- Do not delete `src/integrations/supabase/` or `supabase/` — load-bearing
  (`src/start.ts` imports from it) and reserved for push. See decision log.
- Never edit `src/routeTree.gen.ts` (auto-generated) or `dist/`.
- Project must never live in OneDrive/iCloud-synced folders.

## Current status (2026-07-06)

- ✅ Static SPA build works; Android wrapper generated and committed
- ✅ Full documentation suite in repo root
- ⏭️ **Next up (on the Mac):** `npx cap add ios`, then Xcode build.
  After that: Android Studio build/signing, then Phase 3 (push via Supabase
  Edge Function + FCM — designed in `MAINTAINER_GUIDE.md` §10, not built).
- ⏳ Pending externally: CAG decision on the spouse calendar integration.
