# How the App Works — The Architecture, in Plain Language

> **Who this is for.** Anyone who needs the mental map of this project: what
> the pieces are, how a screen gets to a phone, and which files matter. No
> coding knowledge required; read `READING_THE_CODE.md` for that.

---

## 1. The big picture

**Aviano Air Base is a website wearing a native-app costume.**

- The app itself is a web app (HTML/CSS/JavaScript) built with **React**.
- For the app stores, it is wrapped in a thin native shell using **Capacitor**
  — the `android/` and `ios/` folders are real native projects with the
  website bundled inside them. (iOS builds require the Mac.)
- It is **offline-first**: all content is packed inside the app, so the
  directory and emergency numbers work with no signal. Deliberate choice —
  it's an emergency-info app.

```
┌─────────────────────────────── the phone ───┐
│  Native shell (Capacitor)                    │
│  └── The web app (dist/client)               │
│        └── screens + ALL content bundled in  │  ← works offline
└──────────────────────────────────────────────┘
        needs internet ONLY for: push notifications,
        the embedded FSS Google Calendar, external links
```

## 2. How a screen reaches your eyes (the relay)

```
src/routes/__root.tsx      the shared frame: <html>, bottom nav bar,
        │                  and a "hole" (<Outlet />) for pages
        ▼
src/routeTree.gen.ts       the URL map, AUTO-GENERATED — never edit
        ▼
src/routes/<screen>.tsx    the page for that URL:
        │                    /                 index.tsx   (Home)
        │                    /directory        directory.tsx
        │                    /calendar         calendar.tsx
        │                    /emergency        emergency.tsx
        │                    /pa               pa.tsx       (Public Affairs)
        │                    /housing          housing.tsx
        │                    /security-forces  security-forces.tsx
        │                    /medical-group    medical-group.tsx
        │                    /lrs              lrs.tsx      (Logistics Readiness)
        ▼
src/content/*.json         the DATA the screen displays
        ▼
src/components/ui/*        pre-built pieces it's assembled from (Button, Card…)
```

Two rules of the system:

1. **Filename = URL.** A file `routes/directory.tsx` *is* the `/directory`
   page. Add a file, get a page. A generator keeps `routeTree.gen.ts` in sync
   — that file is rewritten automatically, which is why you never edit it.
2. **Data is separate from display.** Screens contain no phone numbers; they
   read JSON files and render them. Routine updates = editing JSON, never code.

## 3. The folder map

| Path | What it is | Touch it? |
| --- | --- | --- |
| `src/content/` | All editable content (JSON) | ✅ Most edits happen here |
| `src/routes/` | The six screens | ✅ For UI changes |
| `src/components/ui/` | ~50 pre-built UI pieces | ❌ Library — use, don't edit |
| `src/routeTree.gen.ts` | Auto-generated URL map | ❌ Never — it's overwritten |
| `src/integrations/supabase/` | Cloud plumbing (see §5) | ❌ Leave alone |
| `src/server.ts`, `src/start.ts` | Server startup/error plumbing | ❌ Leave alone |
| `public/` | Icons, PWA manifest, `sw.js` (push receiver) | ⚠️ Rarely |
| `assets/` | Source logo for app icons/splash. To regenerate all of them: `npx @capacitor/assets generate --android --ios --iconBackgroundColor '#0b1f3a' --iconBackgroundColorDark '#0b1f3a' --splashBackgroundColor '#0b1f3a' --splashBackgroundColorDark '#0b1f3a'` | ⚠️ Only to rebrand |
| `android/` | The generated Android native project | ⚠️ Only via Capacitor commands |
| `ios/` | The generated iOS native project (SPM — see `MAINTAINER_GUIDE.md` §10) | ⚠️ Only via Capacitor commands |
| `dist/` | Build output — a disposable product | ❌ Never edit; rebuilt every time |
| `vite.config.ts`, `capacitor.config.ts` | Build & wrapper settings | ⚠️ Rarely, deliberately |
| `supabase/`, `.lovable/` | Database migrations / original spec | ❌ Historical + future use |

## 4. From source code to a phone (the pipeline)

```
you edit files  ──►  npm run build  ──►  dist/client/   (a complete static website)
                                              │
                                    npx cap sync android
                                              ▼
                                     android/  (website copied inside
                                                the native project)
                                              ▼
                                     Android Studio builds the .aab
                                              ▼
                                     Google Play  ──►  phones
```

- `npm run build` compiles everything and **bakes the JSON content in**. This
  is why content edits require a rebuild + store update to reach phones.
- The build runs in **SPA mode** (set in `vite.config.ts`): it pre-renders a
  static `index.html` so the app runs from local files with no server.
- `npx cap sync android` copies the fresh build into the Android project.

## 5. The Supabase question (read before deleting anything)

`src/integrations/supabase/` looks unused — there's no login. **It is not
safe to delete.** It is (a) wired into the server startup (`src/start.ts`
imports from it), and (b) the planned home of the push-notification system:
the database holds a `push_subscriptions` table for device tokens, and a
Supabase Edge Function will do the sending. Full reasoning: see the decision
log in `MAINTAINER_GUIDE.md`.

## 6. What lives where (the three locations)

| Location | Holds | If it died |
| --- | --- | --- |
| **GitHub** (`github.com/31fwpa/aviano-app`) | The master copy of all code + full history | Restore from any clone |
| **The admin's computer** (`C:\Users\...\Claude\dev\AvianoApp`) | Working copy + **`.env` secrets (ONLY here — not on GitHub, by design)** | Re-clone from GitHub; `.env` must be re-obtained/regenerated |
| **Supabase** (cloud) | Future: device tokens + the push send function | Push breaks; app content unaffected |

## 7. Design decisions worth knowing (the "why")

- **Static JSON instead of a live database** — simpler, faster, cannot go
  down, works offline. Cost: publishing a content change means shipping an
  app update. Accepted trade-off for reliability.
- **Offline-first** — emergency info must survive no-signal situations.
- **Push via FCM + Supabase, $0/month** — see `MAINTAINER_GUIDE.md` §10 for
  the decision and rejected alternatives.
- **The embedded FSS Google Calendar** (Calendar screen) is the one piece of
  live web content — it needs internet and is maintained by FSS, not us.
- **LRS / Medical Group documents are linked, not bundled** — ~85 PDFs and
  flyers live on the base website; `src/content/documents.json` maps each
  filename to its URL, and unpublished ones show "Coming soon". Reasoning:
  `MAINTAINER_GUIDE.md` §10.
- **External links open in an in-app browser** (`src/lib/native.ts`) so
  people aren't stranded outside the app with no way back.

_Last updated: 2026-08-04._
