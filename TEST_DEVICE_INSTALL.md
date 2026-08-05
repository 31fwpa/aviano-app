# Putting the App on Test Phones

> **Who this is for.** Whoever is installing the app on real phones for
> testing or a demo — before the app is in the stores. Written for the
> 2026-08-05 session and reusable after it.
>
> **The one-sentence summary:** Android is easy (send them a file). iPhone is
> the slow one (each phone must be plugged into the Mac, and the app stops
> working after 7 days) — until the office buys the Apple Developer account.

---

## 1. Before anyone shows up

| Check | How |
| --- | --- |
| Build is current | `npm run build && npx cap sync` from the project folder |
| Android file ready | `~/Desktop/AvianoAirBase-test-2026-08-05.apk` (already built) |
| Mac awake | System Settings → Lock Screen → never sleep on power |
| Cables | **One USB cable per iPhone brand of connector** — this is the #1 thing people forget. Must be a *data* cable, not charge-only |
| Xcode signed in | Xcode → Settings → Accounts → your Apple ID is listed |

**Tell iPhone testers the night before:** their phone will need a **restart**
during setup (Developer Mode). If they can't spare the restart, they can't
get the app.

---

## 2. Android — the easy path (~2 minutes per phone)

Android does not need a cable or a computer. Just get them the `.apk` file.

1. Send `AvianoAirBase-test-2026-08-05.apk` to them — AirDrop-style share,
   email attachment, Google Drive link, or a USB stick. All work.
2. They open the file (Files app → Downloads → tap it).
3. Android will warn: **"For your security, your phone is not allowed to
   install unknown apps from this source."** Tap **Settings** → turn on
   **Allow from this source** → back → **Install**.
4. Open **Aviano Air Base** (wing shield icon).

> **Is that warning a problem?** No. It appears for every app not installed
> from the Play Store. It's the expected path for testing, and it goes away
> once the app is published. Nothing about the app is unsafe — it's the same
> build you've been running.

**Requirements:** Android 7.0 or newer (that's essentially every phone in
use). Nothing else.

### If a phone refuses with "App not installed"

Almost always means an older copy is already there with a different
signature. Uninstall the old one first, then install again.

---

## 3. iPhone — the slow path (~5–10 minutes per phone)

**Every iPhone must be physically plugged into this Mac.** There is no way
around that without the paid Apple Developer account (see §5).

### One-time, on the Mac (do this once, before anyone arrives)

1. `npx cap open ios` from the project folder.
2. Click the blue **App** icon at the top of the left sidebar → **App**
   target → **Signing & Capabilities**.
3. **Automatically manage signing** checked; **Team** = your Apple ID
   ("(Personal Team)").
4. Wait for it to finish with no red errors.

### Per iPhone

1. **Plug the iPhone into the Mac.** Tap **Trust This Computer** on the
   phone, enter their passcode.
2. **Enable Developer Mode** on the phone: **Settings → Privacy & Security →
   Developer Mode** → on → **the phone restarts** → confirm after it boots.
   *(This menu only appears after the phone has been plugged into a Mac
   running Xcode. If they don't see it, wait a few seconds with Xcode open.)*
3. In Xcode's top bar, click the device dropdown and pick **their iPhone**
   (listed under "iOS Device").
4. Press **▶**. Wait for the build to install.
5. First launch is blocked: **"Untrusted Developer."** On the phone go to
   **Settings → General → VPN & Device Management** → tap your Apple ID →
   **Trust**. Launch the app again.

### ⚠️ Tell every iPhone tester this out loud

> **The app will stop opening after 7 days.** That is Apple's limit on
> free-account installs, not a bug in the app. To keep it working, the phone
> has to come back and be plugged in again. If they need it longer than a
> week, we need the Apple Developer account (§5).

Free-account signing is also limited in how many apps and devices it will
carry at once. If Xcode starts refusing new devices, that limit — not the
app — is the cause.

---

## 4. What to tell testers about the app itself

Set expectations so real bugs stand out from known gaps:

- ✅ **Works with no signal** — directory, emergency info, all screens.
  Encourage them to try airplane mode; that's a feature worth showing off.
- ⏳ **Documents say "Coming soon."** The ~85 LRS and Medical Group PDFs
  aren't published to the website yet. Expected, not broken.
- ⏳ **No push notifications yet.** Not wired to Firebase (see
  `PUSH_NOTIFICATIONS.md`). The app will not ask for notification
  permission.
- 🌐 **The calendar needs internet** — it's FSS's live Google Calendar.
  Everything else is bundled.
- 🐛 **Ask them to report anything that looks wrong**, especially content
  that's out of date (phone numbers, hours) — that's the most valuable
  feedback and the easiest to fix.

---

## 5. The upgrade that removes all the iPhone pain

The **Apple Developer Program** ($99/yr, office-funded per
`MAINTAINER_GUIDE.md` §9) unlocks **TestFlight**: testers get an email,
install from the TestFlight app, no cable, no Mac, no 7-day expiry, and up to
10,000 testers. It is also the same account needed for App Store submission
and for iOS push notifications — so it's not optional long-term, only
"not yet."

> **Don't count on it for a same-week demo.** Enrollment needs Apple's
> approval, and organization enrollment (which needs a D-U-N-S number) can
> take days or longer. Start it well before you need it.

---

## 6. Quick troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Mac doesn't see the phone at all | Charge-only cable | Swap cables — this is usually it |
| iPhone: no "Developer Mode" in Settings | Phone hasn't been seen by Xcode yet | Keep it plugged in with Xcode open, wait, re-check |
| iPhone: "Untrusted Developer" on launch | Normal on first install | Settings → General → VPN & Device Management → Trust |
| iPhone: app stopped opening after a week | Free-signing 7-day expiry | Re-plug and press ▶ again, or get the Developer account |
| Android: "App not installed" | Older copy with a different signature | Uninstall the old one, install again |
| Android: no install prompt at all | Source not allowed to install apps | Allow it for the app they opened the file from |

_Last updated: 2026-08-04._
