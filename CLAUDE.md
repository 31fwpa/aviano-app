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

- **App:** "Aviano Air Base" — offline-first info app for Aviano Air Base.
  App ID `mil.af.aviano`. Repo: `github.com/31fwpa/aviano-app`.
  ⚠️ Lovable exports may claim `mil.af.aviano.paconnect` / "Aviano PA
  Connect" — that is NOT this app's identity; never adopt it (see §10).
- **Stack:** TanStack Start (React) in **SPA/static mode** (see
  `vite.config.ts`), Tailwind, content in `src/content/*.json` (NOT the
  database), Capacitor wrapper, Supabase reserved for push notifications.
- **Toolchain:** npm (package-lock.json is authoritative; the old bun.lock is
  historical). On the Windows ARM64 laptop, `npm install --ignore-scripts`
  is required (workerd has no win-arm64 binary). On macOS, plain
  `npm install` should work.
- **Dev preview:** `npm run dev` → http://localhost:8080 (verified).
- **Ship to phones:** `npm run build` → `npx cap sync android` (or `ios`) →
  native build. Content edits need a store release to reach phones.

## Guardrails (non-negotiable)

- Never commit `.env` or weaken `.gitignore`.
- Do not delete `src/integrations/supabase/` or `supabase/` — load-bearing
  (`src/start.ts` imports from it) and reserved for push. See decision log.
- Never edit `src/routeTree.gen.ts` (auto-generated) or `dist/`.
- Project must never live in OneDrive/iCloud-synced folders.

## Current status (2026-07-07)

- ✅ Static SPA build works; Android wrapper generated and committed
- ✅ iOS wrapper generated on the Mac (`npx cap add ios --packagemanager SPM`)
  and verified: simulator build succeeds via `xcodebuild`. Uses Swift Package
  Manager, NOT CocoaPods — see `MAINTAINER_GUIDE.md` §10 before changing.
  iOS pipeline: `npm run build` → `npx cap sync ios` → Xcode.
- ✅ Full documentation suite in repo root
- ✅ iOS app runs in the Xcode simulator (maintainer-verified 2026-07-07).
  No signing team set yet — simulators don't require one.
- ✅ Android debug APK builds on the Mac (SDK installed headlessly at
  `~/Library/Android/sdk`; JDK = Android Studio's bundled JBR 21)
- ✅ **Phase 3 push code implemented** (2026-07-07): `src/lib/push.ts` +
  `device_push_tokens` migration + `send-push` Edge Function. Both platforms
  verified compiling with the plugin. NOT yet live — needs account-based
  setup (Firebase project, Supabase deploy + secrets, APNs key). The
  checklist is `PUSH_NOTIFICATIONS.md`; decisions in `MAINTAINER_GUIDE.md` §10.
- ⚠️ The live Supabase project (`tpmnmsrbcnrhpihuzrcz`) is NOT in the
  maintainer's personal Supabase account (likely Lovable-managed) — AI
  sessions can't reach it via the Supabase connector; deploys go through
  `npx supabase` CLI or the dashboard.
- ⏭️ **Next up:** `PUSH_NOTIFICATIONS.md` §3 (Android push, free) → §4
  (iOS push, needs Apple Developer) → store signing/submissions.
- ✅ **Lovable design changes merged** (2026-08-04) from the `App Changes/`
  folder export: 3 new pages (Security Forces, Medical Group, LRS), floating
  bottom nav + haptics, in-app browser for external links, accent-insensitive
  directory search, calendar simplified to the FSS iframe (events.json and
  its table dropped). Merged by hand — the export predated all native work.
  What was refused and why: `MAINTAINER_GUIDE.md` §10.
- ⏭️ **Documents:** ~85 LRS/MDG PDFs need publishing to the base website,
  then their URLs pasted into `src/content/documents.json` (a content edit —
  `CONTENT_EDITING_GUIDE.md` §4b). They show "Coming soon" until then.
- ❌ CAG/spouse calendar integration is **dropped** (2026-08-04) — FSS's
  calendar is the single source. No longer pending; don't reopen it. See
  `MAINTAINER_GUIDE.md` §10.
