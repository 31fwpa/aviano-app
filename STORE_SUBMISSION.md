# Store Submission — Compliance Checklist

> **Audited 2026-09-02.** What was checked, what was fixed in the code, and
> what still needs a human with the right accounts. Nothing here guarantees
> approval — reviewers make judgement calls — but these are the concrete
> requirements both stores publish.

---

## 1. Fixed in the app already

| Item | What was wrong | Now |
| --- | --- | --- |
| **Privacy policy** | Neither store accepts a submission without one. There was none. | `/privacy` screen in the app, linked from Home. Written against what the code actually does. |
| **Non-HTTPS links** | 4 links used plain `http://`. iOS App Transport Security discourages these and they look careless in review. | Upgraded the 3 that answer over HTTPS. One left — see §3. |
| **Third-party asset** | Social preview tags pointed at a screenshot on Lovable's CDN — a URL we don't control. | Now the app's own bundled icon. |
| **Encryption declaration** | `ITSAppUsesNonExemptEncryption` was unset, so App Store Connect asks on every single upload. | Set to `false` in `Info.plist`. The app uses only standard HTTPS, which is exempt. |
| **Placeholder UI** | Buttons popped `TODO: Link for "..."`. Apple rejects placeholder content outright (Guideline 2.1). | Removed — every link works or says "Coming soon". |
| **Permissions** | — | Android declares only `INTERNET`. No location, camera, contacts, or storage. Nothing to justify. |
| **Target SDK** | — | `targetSdk 36`, above Google's current floor. `minSdk 24` covers Android 7+. |

## 2. Blocking — needs your accounts

### a. Signing

- **Android:** no release signing config exists; only debug builds. You must
  create an upload keystore and add it to `android/app/build.gradle`.
  **Back the keystore up somewhere safe** — Google ties the app to it
  permanently and losing it means never updating the published app.
- **iOS:** no signing certificate on this Mac. Needs the Apple ID sign-in in
  Xcode, and an **organization** account for release (see §2c).

### b. Privacy declarations in the store consoles

Both stores make you declare data collection separately from the policy page.
This app's honest answer:

- **Collected:** a push notification token, only if the user allows
  notifications. Not linked to identity, not used for tracking.
- **Not collected:** name, e-mail, location, contacts, photos, identifiers.
- **Play "Data safety":** declare *Device or other IDs* → collected, app
  functionality, not shared, not linked to the user.
- **Apple "Privacy Nutrition Label":** *Identifiers → Device ID*, used for App
  Functionality, **not** linked to the user, **not** used for tracking.

> Get this right. Mismatches between the declaration and actual behaviour are
> a common rejection reason, and push tokens are easy to forget.

### c. Apple requires a government app to come from the government

App Store Review Guideline **5.2.1** and the developer agreement: an app that
represents a government entity must be published by that entity, under an
**Apple Developer Program organization account** — not an individual's. A
personal account carrying official 31 FW branding is a likely rejection.

Enrolment as an organization needs a D-U-N-S number and takes time. **Start
early.** The free-Apple-ID route works for testing on your own devices but
cannot be used to publish.

### d. Store listing content

Needed for both: app name, subtitle/short description, full description,
screenshots at required sizes, category, age rating questionnaire, support
URL, and a **publicly reachable privacy policy URL** (the in-app page is not
enough — the console needs a web address; publish the same text on the base
website or 31fss.com).

## 3. Worth doing before you submit

- **`http://woundedwarrior.af.mil`** — the one link still on plain HTTP. It
  didn't answer over HTTPS from this machine, which may be a network
  restriction rather than the site. Check it from a base connection and
  upgrade it if it works.
- **Version numbers** — still `versionCode 1` / `versionName 1.0`. Fine for a
  first release; increment `versionCode` on every subsequent upload or Play
  will reject it.
- **Check every outbound link once.** The app links to ~25 external domains.
  A reviewer clicking a dead link sees a broken app.
- **CAC-gated links.** Several targets (DPS, DTS, the AFOSI forms, Pass & Reg
  systems) need a CAC or DoD network. A reviewer outside that will hit a login
  wall. Not a violation, but say so in the review notes so it isn't mistaken
  for a broken feature.

## 4. Apple Guideline 4.2 — "minimum functionality"

Apple rejects apps that are only a website in a wrapper. This app has a solid
case and it is worth stating in the review notes:

- 91 documents bundled and readable **with no connection**
- A native document viewer, not a link-out
- Offline directory and emergency information
- Native calendar rendering from a live feed
- Push notifications (once configured)

The point to make: **the app's core value is that it works without a signal**,
which a website cannot do.

## 5. Content and rights

- The wing shield and Air Force marks are used by the office that owns them —
  fine, but the submitting account must be the one entitled to use them (§2c).
- Everything published is public-release base information; no CUI, no PII.
- Age rating: no objectionable content. Note that the app links out to
  third-party sites when answering the questionnaire.

_Last updated: 2026-09-02._
