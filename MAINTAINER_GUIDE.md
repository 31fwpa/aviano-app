# Aviano Air Base App — Maintainer's Guide

> **Purpose of this document.** This is the handoff manual for whoever maintains
> this app after the current administrator leaves. It is written in plain
> language for people who are *not* professional programmers. If you are staring
> at this project for the first time and feeling lost — start here, read top to
> bottom, and don't panic. Everything you need is in this folder.
>
> **This is a living document.** It was started while the first administrator was
> still learning the app, so it grows section by section. If something is marked
> _"(to be written)"_, it hasn't been documented yet — and if *you* learn it,
> please add it. The best gift you can leave the next person is a more complete
> version of this file.

---

## Table of contents

1. [What this app is](#1-what-this-app-is)
2. [Who runs it (accounts & access)](#2-who-runs-it-accounts--access)
3. [Git & GitHub — the basics you actually need](#3-git--github--the-basics-you-actually-need)
4. [The everyday workflow](#4-the-everyday-workflow)
5. [Guardrails — rules that prevent disasters](#5-guardrails--rules-that-prevent-disasters)
6. [How the app is built → see HOW_THE_APP_WORKS.md](#6-how-the-app-is-built)
7. [Editing content (phone numbers, events, etc.) → see CONTENT_EDITING_GUIDE.md](#7-editing-content)
8. [Deploying / publishing changes _(to be written)_](#8-deploying--publishing-changes)
9. [Going native — app store roadmap](#9-going-native--app-store-roadmap)
10. [Key decisions on record](#10-key-decisions-on-record)
11. [Glossary](#11-glossary)

---

## 1. What this app is

A **Progressive Web App (PWA)** for Aviano Air Base members — an installable,
phone-style app with four screens: **Home, Directory, Calendar, and Emergency.**

- It was originally scaffolded with a tool called **Lovable** (see `.lovable/plan.md`
  for the original design spec — a useful record of *what was intended*).
- It is built on **TanStack Start (React)** for the screens and **Supabase** for
  the database, login, and push notifications.
- You do **not** need to understand all of that to keep the app running. Most
  day-to-day maintenance is editing data files and pushing the change. The deeper
  architecture is covered in [Section 6](#6-how-the-app-is-built).

---

## 2. Who runs it (accounts & access)

- **GitHub organization:** `31fwpa`
- **Repository:** `github.com/31fwpa/aviano-app` *(the code lives here)*
- **The administrator controls who has access.** As admin you decide who can
  *edit* (push changes) and who can only *read*. Most content editors only need
  to touch data files — they don't need access to the code.

### Where the project lives on this computer

The working copy is at:

```
C:\Users\beans\Claude\dev\AvianoApp
```

> **⚠️ Do NOT store this project inside OneDrive (or Dropbox / Google Drive).**
> Git keeps its history in thousands of tiny files inside a hidden `.git` folder.
> OneDrive tries to sync every one of them in real time, and the two backup
> systems fight: at best you get "deletion failed" / "device or resource busy"
> errors, and at worst OneDrive corrupts the repository. You already have a cloud
> backup — it's GitHub. Keep the repo in a plain local folder like
> `C:\Users\...\dev\`, **never** under a cloud-synced folder.
>
> _(This project was originally created inside OneDrive and moved out for exactly
> this reason. If you ever clone it fresh, clone it to a non-synced folder.)_

> **Handoff checklist when an admin leaves:** transfer GitHub org ownership,
> Supabase project ownership, and the Lovable account to the successor *before*
> the departing admin loses their accounts. Losing admin access with no successor
> named is the worst-case scenario. _(Expand this checklist as you learn the
> full list of accounts involved.)_

---

## 3. Git & GitHub — the basics you actually need

**Git and GitHub are two different things.**

- **Git** is a program on *your computer*. It saves snapshots of the project so
  you can rewind and see what changed. Works offline.
- **GitHub** is a *website* that stores the shared master copy in the cloud so the
  whole team can work on it.

> Think: **Git = "Save" on my laptop. GitHub = "Save to the shared drive."**

### Why bother with it at all?

- **An undo button with no expiration.** Every snapshot ("commit") is a restore
  point. Break something? Roll back. No more `app_FINAL_v2_realfinal` folders.
- **A history of what changed, when, and by whom** — so you can answer "when did
  this break?"
- **It's the project's backup.** If a laptop dies, the app is safe on GitHub.

### The core vocabulary

| Git word | Plain English |
| --- | --- |
| **commit** | Save a checkpoint on my laptop |
| **push** | Upload my checkpoints to GitHub |
| **pull** | Download everyone else's latest changes |
| **clone** | Download the whole project the first time |
| **remote** | Git's nickname for "the GitHub copy" (usually called `origin`) |

---

## 4. The everyday workflow

95% of your Git life is these five commands, in this order. Run them from inside
the `AppFiles` folder in a terminal.

```bash
git pull                       # 1. Get everyone's latest changes FIRST
# ...make your edits...
git status                     # 2. See what you changed (read-only, always safe)
git add .                      # 3. Stage your changes
git commit -m "Clear message"  # 4. Snapshot them locally
git push                       # 5. Send them up to GitHub
```

Two habits that prevent most problems:

- **`git pull` before you start working.** Skipping this is the #1 cause of
  merge headaches. *"Pull before you push."*
- **`git status` is free and safe — run it constantly.** It changes nothing and
  tells you exactly what state you're in. When in doubt, `git status`.

---

## 5. Guardrails — rules that prevent disasters

| Rule | Why it matters |
| --- | --- |
| **Never commit secrets** (`.env`, passwords, API keys) | Once pushed, a secret is considered leaked *forever* — even if you delete it later. The `.gitignore` file is set up to keep `.env` out; do not remove that protection. |
| **Glance at `git status` before `git add .`** | Confirms you aren't about to commit something you shouldn't (like `.env`). |
| **Write a real commit message** | "Updated stuff" helps no one. "Fix MPF phone number" tells the future exactly what happened. |
| **One change, one commit** | Small, focused snapshots are easy to understand and undo. Don't bundle ten unrelated edits. |
| **Don't panic — Git rarely truly loses anything** | If something looks wrong, *stop and ask* before running scary commands. Almost everything is recoverable from history. |

> **The cardinal sin:** committing the `.env` file. It holds the database and
> push-notification secret keys. It must never reach GitHub. This is why
> `.gitignore` lists `.env` — leave that line alone.

---

## 6. How the app is built

**See [`HOW_THE_APP_WORKS.md`](HOW_THE_APP_WORKS.md)** — the full architecture
in plain language: the screen relay, the folder map (safe vs. off-limits), the
build pipeline to the phone, and the design decisions. Companion guides:
[`READING_THE_CODE.md`](READING_THE_CODE.md) (code literacy for non-programmers)
and [`EDITING_THE_APP.md`](EDITING_THE_APP.md) (the safe change workflow).

---

## 7. Editing content

**See [`CONTENT_EDITING_GUIDE.md`](CONTENT_EDITING_GUIDE.md)** — a standalone,
plain-language guide written for content editors who don't code. It covers the
five data files in `src/content/`, JSON basics, copy-paste recipes for every
common task (announcements, phone numbers, events, emergency info), validation
with jsonlint.com, and both publishing paths (local Git and editing directly on
github.com in the browser).

Hand that file to PA staff or anyone who maintains content. Keep this guide for
the technical/administrative side.

---

## 8. Deploying / publishing changes

_(To be written.)_ This section will explain what happens after you push — how a
change actually reaches the live app that base members see.

---

## 9. Going native — app store roadmap

**Goal (mandated by leadership):** ship the app to both the **Apple App Store**
and **Google Play Store**, with working **push notifications on phones**.

### The core concept

What we have today is a **PWA** — a website that installs from the browser. The
app stores require a **native app** (an `.ipa` for Apple, an `.aab` for Google).
You cannot upload the web files directly; the web app must be **wrapped** in a
thin native shell the stores will accept. The chosen tool for this is
**Capacitor**.

> **Effort reality check.** Editing the app (content + screens) is cheap and
> stays cheap. The *wrappers* are the time sink — new tools (Xcode, Android
> Studio), two new push services (Apple's APNs, Google's FCM), and store review.
> Budget your patience for the wrappers, not the app itself.

### Architecture: bundle it offline (the app's content is static)

Every screen reads its data from JSON files bundled into the app at build time —
there is **no live server call to display a page**. So the app is designed to be
**bundled inside the native package and run fully offline.** This is deliberate
and correct: this is a base emergency app, and the emergency numbers must work
with **no signal**.

> **"Works offline" and "has push notifications" are two different things.**
>
> | Function | Needs internet? | Why |
> | --- | --- | --- |
> | Showing the screens (directory, emergency…) | No | The data is bundled in the app. |
> | Receiving a push | Yes, at that moment | Apple/Google must deliver it. |
> | Registering for push (first launch) | Yes, once | The app fetches a device token. |
> | **Sending** a push (admin broadcast) | Yes — needs a **cloud server** | Something must hold the APNs/FCM credentials and fan out. |
>
> So: **the app runs offline; push, by nature, does not.** Sending push needs a
> small cloud component that is **not** bundled in the app (see below).

### Two technical wrinkles to know

1. **The app is currently configured for server-rendering (SSR).** See
   `vite.config.ts` (it builds a server entry and targets Cloudflare). To bundle
   the app offline for Capacitor, it must instead produce a **static client
   build** — a plain folder of HTML/JS/CSS that runs from local files. The
   *content* is static, so this is very likely doable, but converting the build
   target from "SSR" to "static bundle" is the real work of the offline path and
   should be verified as cleanly supported before promising a date.
2. **No Cloudflare needed to serve the app.** Because the app is bundled inside
   the native package, you do **not** need to host it at a public URL to ship it.
   (`wrangler.jsonc` / Cloudflare were never set up, and the offline approach
   doesn't require them.)
3. **But you DO need a small cloud function to *send* notifications.** This is
   where keeping Supabase pays off: Supabase can host both the
   `push_subscriptions` table *and* a small "Edge Function" that performs the
   actual send. The piece that was almost deleted is exactly the cloud component
   the offline app still needs for push.
4. **Apple may reject "just a website in a wrapper"** (App Store Guideline 4.2).
   An offline, official base app *with real push notifications* has a strong
   case, but expect a review revision or two.

### The phases (in order)

| Phase | What happens | Difficulty |
| --- | --- | --- |
| 1. Produce a static client build | Convert the SSR build target so it outputs a plain HTML/JS/CSS folder Capacitor can bundle and run offline. No Cloudflare/hosting needed. | Moderate |
| 2. Add Capacitor, generate `ios/` + `android/` projects | `npm install @capacitor/core`, init, add platforms. | Moderate |
| 3. **Rework push to native** | Set up Firebase (FCM) for Android + APNs for iOS; swap web-push/VAPID for `@capacitor/push-notifications`; update the server to fan out via FCM/APNs. | **Hard — the real engineering** |
| 4. Build & test on real devices | Android Studio (Windows OK) + Xcode (Mac required). | Fiddly |
| 5. Store listings + submit | Icons, screenshots, descriptions, privacy info, review. | Tedious |

**Phase 3 is the bulk of the work.** Wrapping the UI is nearly easy; rebuilding
the notification pipeline onto Apple's and Google's native services is a genuine
backend project.

### Recommended sequence: **Android first, then iOS**

Android is cheaper, builds on Windows, has no "thin wrapper" review risk, and its
push (FCM) is simpler to stand up. Getting the full pipeline working once on
Android teaches everything needed before tackling Apple's stricter process.

### Prerequisites & costs

- **Apple Developer Program** — $99/year, and a **Mac is required** to build/submit iOS.
- **Google Play Developer** — $25 one-time, buildable from Windows.
- Both stores **manually review** submissions; plan for revisions.

---

## 10. Key decisions on record

Decisions made deliberately, with the reasoning, so future maintainers don't
re-litigate them or undo them by mistake.

### Do NOT delete the Supabase files (yet)

The `src/integrations/supabase/` folder and the top-level `supabase/` folder
**look** unused because there is no login in the app. **Leave them alone.** Two
concrete reasons:

1. **They are load-bearing, not litter.** `src/start.ts` imports
   `attachSupabaseAuth` from `src/integrations/supabase/auth-attacher.ts` and
   wires it into the server's startup. Delete the folder and the server won't
   boot.
2. **Push notifications need a database.** Supabase already contains a
   `push_subscriptions` table — exactly the kind of store the native push work
   (Phase 3 above) will likely reuse to hold each device's token.

> **Principle:** "looks unused" is a hypothesis, not a fact. Before deleting
> anything, search the code for what *imports* it. *Dead* code (nothing
> references it) is safe to remove; *dormant* code (wired in but idle) is a trap.
> Git keeps full history, so there's never a rush — delete when you *know*, not
> when you *guess*. Revisit this decision after Phase 3.

### Push notifications: Supabase Edge Function + FCM (free)

**Security sign-off:** leadership confirmed this app holds nothing the DoD
restricts from public sharing, so commercial managed cloud is approved. We
therefore chose the easiest free path (no government infrastructure required).

**The chosen design:**

- **Sender:** a single **Supabase Edge Function** (serverless — runs only when an
  alert is sent, $0 at this volume). It holds the FCM credentials and reads
  device tokens from the existing `push_subscriptions` table.
- **Delivery:** **Firebase Cloud Messaging (FCM)** delivers to **both** platforms
  — Android directly, and iPhone via Apple's APNs under the hood. One service,
  not two.
- **In the app:** Capacitor's `@capacitor/push-notifications` registers each
  device and stores its token.

**Cost:** Supabase free tier + FCM = **$0 ongoing.** The only costs are the Apple
($99/yr) and Google ($25 once) store memberships, covered by the office.

**Update 2026-07-07 — Phase 3 code is built.** App-side registration
(`src/lib/push.ts`), the `device_push_tokens` table (migration in
`supabase/migrations/`), and the `send-push` Edge Function are all in the
repo. What remains is account-based setup — the full checklist is
`PUSH_NOTIFICATIONS.md`. Two decisions made during implementation:

1. **Sender auth is a shared secret header (`x-admin-key`), not user
   accounts.** The app has no login system, so "is the caller an admin"
   can't be answered with user JWTs. A long random secret stored as an Edge
   Function secret is simple, revocable in one command, and fits the single
   sender (PA/admin) reality. Revisit if the app ever gets real logins.
2. **iOS needs the Firebase SDK added in Xcode before iOS delivery works**
   (FCM can't address raw Apple push tokens). Until then, iOS devices store
   Apple-format tokens that the sender safely prunes. Android needs no such
   step. Details: `PUSH_NOTIFICATIONS.md` §4.

**Rejected alternatives and why:**

- *Base `.af.mil` website* — government-managed; you can't deploy custom code or
  store credentials there.
- *OneSignal (third-party push service)* — easiest technically, but a third party
  holding the data; unnecessary once self-hosted Supabase was approved.
- *Truly self-hosted / government cloud* — large ops lift (ATO, infrastructure);
  not required given the security sign-off above.

### iOS native dependencies: Swift Package Manager, NOT CocoaPods

When the iOS wrapper was generated (2026-07-07), Capacitor offered two ways
to manage the native iOS dependencies:

- **CocoaPods** — the older default. A separate tool that must be installed
  on the Mac (it needs Ruby, and realistically Homebrew too).
- **Swift Package Manager (SPM)** — Apple's own dependency manager, built
  into Xcode. Nothing extra to install, ever.

We chose **SPM** (`npx cap add ios --packagemanager SPM`): fewer tools to
install and maintain on the build Mac, and all official Capacitor plugins —
including `@capacitor/push-notifications`, planned for Phase 3 — support it.

**Practical consequences for whoever builds iOS:**

- Open **`ios/App/App.xcodeproj`** in Xcode. (CocoaPods projects use a
  `.xcworkspace` file instead — this project doesn't have one, and that's
  normal.)
- Native dependencies are declared in `ios/App/CapApp-SPM/Package.swift`.
  That file is managed by `npx cap sync ios` — don't edit it by hand.
- If a tutorial tells you to run `pod install`, it's written for the
  CocoaPods path — skip that step; it doesn't apply here.

### One calendar only: 31 FSS. CAG integration dropped (2026-08-04)

The app once planned to pull in a second, spouse-facing calendar via the CAG.
**That is no longer happening.** The Calendar screen embeds the **31 FSS
Community Calendar** and nothing else.

Why this is recorded rather than just deleted: the CAG integration sat on the
roadmap as "pending an external decision" for months, and a future maintainer
finding a half-referenced idea would reasonably try to revive it. It was
dropped deliberately — one calendar, maintained by FSS in Google Calendar, is
simpler to run and impossible to get out of sync with itself.

Practical consequences:

- The Calendar screen needs **no content maintenance** from this app. FSS
  publishes to their Google Calendar; the app shows it live.
- It is the app's one piece of live web content — it needs internet, unlike
  every other screen.
- The app's own `events.json` list and the `events` database table were
  removed in the same cleanup (see the migration
  `20260803080000_drop_events_table.sql`).

### Merging work back from Lovable (2026-08-04)

Design changes made in Lovable were delivered as a full folder copy
(`App Changes/`) rather than through Git, so they had to be merged by hand.
That export branched from an **older** commit — it predates all the native
work — so blindly copying it over would have silently deleted the push
pipeline, the icons, and the app identity. What was taken and what was
refused, and why:

**Taken:** the three new pages (Security Forces, Medical Group, LRS), the
redesigned floating bottom nav, haptic feedback (`src/lib/haptic.ts`),
native status-bar + in-app-browser behavior (`src/lib/native.ts`),
accent-insensitive directory search, the simplified calendar (Google iframe
only), and the corrected announcement/phone content.

**Refused, and why it matters:**

| Lovable file | Why it was NOT taken |
| --- | --- |
| `capacitor.config.ts` | Declared a *different app*: `appId` `mil.af.aviano.paconnect`, name "Aviano PA Connect", `webDir` `dist`. Adopting it would change the store identity (a new bundle ID cannot update an already-published app) and break the build path. |
| `vite.config.ts` | Missing the SPA/prerender block — the app would stop producing a static offline bundle. |
| `README-NATIVE.md` | Points at a different repo and tells you to install CocoaPods; contradicts the SPM decision above and the guides in this repo. |
| Half of migration `20260708073034` | It dropped `public.notifications`. The `send-push` Edge Function writes to that table — it is the record of every broadcast sent to the base. Only the `push_subscriptions` half was kept (genuinely dead web-push). |

> **The lesson worth keeping:** an export from a web builder is a *branch*,
> not an update. Diff it, take the intent, and re-apply it on top of the
> current code — never copy the folder over the repo.

### REVERSED 2026-08-18: documents are now bundled in the app

The decision below (link, don't bundle) was **reversed**. The 45 PDFs we hold
now ship inside the app and open in an in-app viewer, working with no signal.

**What changed the call:**

- **Size was the weakest objection and it didn't survive the numbers.** The
  app goes from ~10 MB to ~34 MB. Play Store's limit is 200 MB; this is
  unremarkable. (PDFs are already compressed — 37 MB of them zip to 34 MB, so
  the bundle grows by roughly the full file size.)
- **The people who need these documents most often have the least
  connectivity.** Someone who has just PCS'd in may have no Italian SIM and no
  home internet — and PCS, housing, and IAR paperwork is exactly what they
  need. The earlier assumption that these are "read at a desk on wifi" was
  wrong for the highest-need user.
- **Bundling isn't blocked.** Publishing to AFPIMS needs 508 review, public
  release review, and site access. Bundling ships now.

**What it cost:** an in-app PDF viewer (`src/routes/document.tsx`), because
**Android's WebView cannot render a PDF** — a plain link to a bundled file
opens a blank screen. pdf.js renders to canvas instead, identically on both
platforms, with no dependency on the user having a PDF app installed.

**What we gave up:** a corrected document now requires a store release to
reach phones. That is the accepted trade-off, and it is the same one the app
already makes for all its other content. `documents.json` still works for
anything not bundled, so publishing to the website remains available per
document.

### Superseded: why documents were originally linked, not bundled

The LRS and Medical Group pages reference ~85 PDFs and info flyers. In
Lovable those files live on Lovable's own CDN, at URLs that only resolve
while the app is running on Lovable — inside the native app they are dead
links. The decision (2026-08-04) is to **publish those files on the base
website and link to them**, rather than bundling them in the app:

- They are reference/planning documents, not emergency information — the
  offline-critical content (numbers, procedures) stays bundled as JSON.
- Linked files can be corrected without shipping a store update; a bundled
  PDF would need a full release for every revision.
- It keeps the app ~24 MB smaller.
- Android's webview cannot display a bundled PDF anyway; an https link opens
  cleanly in the in-app browser (`src/lib/native.ts`).

`src/content/documents.json` maps each filename to its published URL. Until a
URL is filled in, the pages show their built-in "Coming soon" state, so
nothing ever renders as a broken link. Adding a document is a **content
edit** — see `CONTENT_EDITING_GUIDE.md`.

### How to test outbound links (2026-09-03)

Link rot is the app's main ongoing maintenance burden. How you test matters
more than it looks, and the obvious method is wrong:

- **`curl` from a laptop is not evidence.** Most `.mil` hosts and many
  commercial ones (Lufthansa, DoDEA, Red Cross, AFN) return `403` or no
  response to `curl` while working perfectly in a real browser. Three links
  were nearly deleted on this bad evidence. **A non-200 from curl proves
  nothing.**
- **Status codes lie in the other direction too.** Several links returned
  `HTTP 200` while serving the wrong page — a *soft 404*. `aviano.af.mil`
  keeps the URL in the address bar and quietly serves "News"; five
  `31fss.com` links returned 200 but redirected to a bare banner JPEG;
  `shopmyexchange.com` returned 200 with "Content not found" in the body.
  **Check the page title and body text, not the status code.**
- **The network matters.** On base wifi every `.mil` host stalled; on
  cellular the same links worked. Test on more than one network before
  concluding anything.
- **The phone is the environment that counts.** `scripts/test-links-on-phone.sh`
  opens each URL on a connected Android phone and screenshots the result.
  Reviewing those screenshots is the only test that shows what a user
  actually gets — a page, a CAC prompt, or an error. Leave the phone alone
  while it runs.
- **A CAC-locked link is not a broken link**, but it is useless in a public
  app; those were removed deliberately.

When a link does die, prefer finding the moved page over deleting the entry —
most "dead" links have just moved. e-Publishing shuffles publications between
owning-org folders without redirecting, and its own product search API
(`/DesktopModules/MVC/EPUBS/EPUB/GetPubsSearchView/?keyword=<pub number>`)
gives the current URL. Keep the entry's phone number and details even when no
replacement page exists — clear only the `url` field.

### The project must NOT live in OneDrive

See [Section 2](#2-who-runs-it-accounts--access). Git and OneDrive fight over the
`.git` folder. The repo was moved out of OneDrive to
`C:\Users\beans\Claude\dev\AvianoApp` for this reason.

---

## 11. Glossary

| Term | Meaning |
| --- | --- |
| **PWA** | Progressive Web App — a website that installs and behaves like a phone app. |
| **Repository (repo)** | A project folder that Git is tracking. |
| **Commit** | A saved snapshot of the project at a point in time. |
| **Push / Pull** | Upload to / download from GitHub. |
| **Remote / `origin`** | The GitHub copy of the project. |
| **`.env`** | A file holding secret keys. Must never be committed. |
| **`.gitignore`** | A list of files Git should ignore (never track). |

---

_Last updated: 2026-07-07 (iOS/SPM decision recorded during a Claude Code
session). Add your name and the date when you edit this guide._
