# Push Notifications — How They Work and How to Finish Setting Them Up

> **Who this is for.** The maintainer wiring up (or debugging) push
> notifications. The code is all written and committed; what remains are
> account-based setup steps that only a human with the right logins can do.
> Work top to bottom. Design decisions behind all this: `MAINTAINER_GUIDE.md`
> §9–10.

---

## 1. The big picture

```
 ADMIN sends an alert                        EVERY PHONE with the app
 ────────────────────                        ───────────────────────
 curl (or admin tool)                                ▲
        │  x-admin-key secret                        │ notification pops up
        ▼                                            │
 Supabase Edge Function  ──►  Firebase Cloud  ──►  (Android directly,
 "send-push"                  Messaging (FCM)       iPhone via Apple APNs)
        │
        └── reads device tokens from the device_push_tokens table
            (each app registers itself there on first launch)
```

- **The app registers itself.** On first launch the app asks "Allow
  notifications?" — if the user agrees, the phone gets a **device token**
  (an address for that one phone) and the app stores it in the
  `device_push_tokens` table in Supabase.
- **Sending fans out.** The `send-push` Edge Function reads every stored
  token and asks FCM to deliver the message to each one. FCM handles both
  platforms — Android natively, iPhones by relaying through Apple's APNs.
- **It cleans up after itself.** When FCM reports a token as dead (app
  uninstalled, token rotated), the function deletes that row. Every send is
  recorded in the `notifications` table (what, when, how many devices).

## 2. What is already built (committed in this repo)

| Piece | Where |
| --- | --- |
| App-side registration + tap handling | `src/lib/push.ts`, wired in `src/routes/__root.tsx` |
| Native plugin | `@capacitor/push-notifications` (package.json, both platforms synced) |
| iOS APNs → Capacitor hooks | `ios/App/App/AppDelegate.swift` |
| Device token table + security rules | `supabase/migrations/20260707120000_device_push_tokens.sql` |
| The sender | `supabase/functions/send-push/index.ts` |

The old **web push** files (`public/sw.js`, `src/lib/vapid.ts`, the
`push_subscriptions` table) belong to the earlier browser-PWA design. They
are dormant, harmless, and still used for plain-browser visits — leave them;
the native pipeline above is what ships to phones.

## 3. Setup checklist — Android first (free, no Apple account needed)

### A. Create the Firebase project (one time, free)

1. Go to **console.firebase.google.com** → *Add project* (any Google account
   the office controls — treat it like the other office accounts in
   `SETUP_NEW_COMPUTER.md` §7). Name it e.g. `aviano-app`. Analytics: off.
2. In the project: *Add app* → **Android**. Package name must be exactly
   **`mil.af.aviano`**.
3. Download **`google-services.json`** and place it at **`android/app/google-services.json`**.
4. Commit it. *(Yes, really — it contains identifiers, not secrets; it ships
   inside every APK anyway. The Gradle build detects it automatically and
   switches push support on.)*

### B. Get the server credential (SECRET — handle like `.env`)

1. Firebase console → ⚙ *Project settings* → *Service accounts* →
   **Generate new private key**. A JSON file downloads.
2. This file lets anyone send notifications as us. **Never commit it,
   never email it.** It goes into Supabase as a secret (next step), then
   store the file wherever the office keeps the other credentials.

### C. Set up the Supabase side

The database and function code live in this repo but must be pushed to the
live Supabase project (`tpmnmsrbcnrhpihuzrcz`). Using the Supabase CLI via
npx (no install needed), from the project folder:

```bash
npx supabase login                # opens browser; needs the Supabase account
npx supabase link --project-ref tpmnmsrbcnrhpihuzrcz
npx supabase db push              # applies the device_push_tokens migration
npx supabase functions deploy send-push --no-verify-jwt
npx supabase secrets set ADMIN_PUSH_KEY="<invent a long random password>"
npx supabase secrets set FCM_SERVICE_ACCOUNT="$(cat ~/Downloads/<the-key-file>.json)"
```

> **Why `--no-verify-jwt`?** The app has no user logins, so the function
> can't check "is this an admin user". Instead it requires the
> `x-admin-key` secret header. See the decision log, `MAINTAINER_GUIDE.md` §10.
>
> *(Alternative without the CLI: paste the migration into the Supabase
> dashboard's SQL Editor, create the function in the dashboard's Edge
> Functions editor, and add the two secrets under Edge Functions → Secrets.)*

### D. Make sure builds include the Supabase address — and switch push on

The app can only store its token if `.env` (with `VITE_SUPABASE_URL` and
`VITE_SUPABASE_PUBLISHABLE_KEY`) exists **at build time**. `.env` lives only
on maintainer machines (see `HOW_THE_APP_WORKS.md` §6) — if you're building
on a machine that doesn't have it, copy it from the machine that does,
hand-to-hand, never through email/chat/cloud.

Then add one more line to `.env`:

```
VITE_PUSH_ENABLED=true
```

> **Why this flag exists (learned the hard way):** if the app attempts push
> registration before `google-services.json` is in place, the Android app
> **crashes natively on every launch** — the failure happens below the
> JavaScript layer where it can't be caught (verified on a real phone,
> 2026-07-07). So push registration stays off until this flag is set at
> build time, and the flag must only be set **after** step A is done.

### E. Test on Android

1. `npm run build && npx cap sync android`, then build/run from Android
   Studio onto a device or a **Google Play**-flavored emulator image (plain
   AOSP images have no FCM).
2. Launch the app, tap *Allow* on the notification prompt.
3. Check the Supabase dashboard → Table Editor → `device_push_tokens` — a
   row should appear.
4. Send a test:

```bash
curl -X POST https://tpmnmsrbcnrhpihuzrcz.supabase.co/functions/v1/send-push \
  -H "content-type: application/json" \
  -H "x-admin-key: <the ADMIN_PUSH_KEY you set>" \
  -d '{"title":"Test","body":"Hello from the Edge Function","link":"/emergency"}'
```

The response reports `{"sent":1,...}` and the notification appears on the
device. Tapping it opens the app at `/emergency`.

## 4. Setup checklist — iOS (needs the Apple Developer account)

Do this after Android works. It cannot be tested without the paid Apple
Developer membership and a **real iPhone** (simulators can't receive real
pushes).

1. **APNs key:** developer.apple.com → *Certificates, Identifiers &
   Profiles* → *Keys* → new key with **Apple Push Notifications service**
   → download the `.p8` file (secret! one download only — store it with the
   office credentials).
2. **Give it to Firebase:** Firebase console → *Project settings* → *Cloud
   Messaging* → Apple app configuration → upload the `.p8` (plus its Key ID
   and the Team ID). Also *Add app* → **iOS**, bundle ID `mil.af.aviano`,
   and download `GoogleService-Info.plist`.
3. **In Xcode** (`npx cap open ios`):
   - Drag `GoogleService-Info.plist` into the `App/App` folder (check
     "Copy items if needed", target *App*).
   - *Signing & Capabilities* → *+ Capability* → **Push Notifications**.
   - *File → Add Package Dependencies* → `https://github.com/firebase/firebase-ios-sdk`
     → add **FirebaseMessaging** to the App target.
     *(Why: FCM can't address a raw Apple token; the Firebase SDK swaps it
     for an FCM token. Until this step, iOS devices store Apple-format
     tokens that the sender automatically prunes — harmless, but no iOS
     delivery.)*
4. **Update `AppDelegate.swift`** — add the imports and replace the token
   handoff (the `// MARK: Push notifications` block already there):

```swift
import FirebaseCore
import FirebaseMessaging
```

```swift
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        FirebaseApp.configure()
        return true
    }

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Messaging.messaging().apnsToken = deviceToken
        Messaging.messaging().token { token, error in
            if let error = error {
                NotificationCenter.default.post(name: .capacitorDidFailToRegisterForRemoteNotifications, object: error)
            } else if let token = token {
                NotificationCenter.default.post(name: .capacitorDidRegisterForRemoteNotifications, object: token)
            }
        }
    }
```

5. Build onto a real iPhone, allow notifications, confirm a row lands in
   `device_push_tokens` (platform `ios`), and re-run the test curl.

## 5. Day-to-day: sending an alert

One command (or give PA a tiny script/shortcut around it):

```bash
curl -X POST https://tpmnmsrbcnrhpihuzrcz.supabase.co/functions/v1/send-push \
  -H "content-type: application/json" \
  -H "x-admin-key: <secret>" \
  -d '{"title":"...","body":"...","link":"/"}'
```

- `link` is optional; must be an in-app path (`/emergency`, `/pa`, …) —
  tapping the notification opens the app there.
- Every send is logged in the `notifications` table.
- If the `x-admin-key` ever leaks, set a new one:
  `npx supabase secrets set ADMIN_PUSH_KEY="<new>"` — old key stops working
  immediately.

## 6. Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| App crashes on every launch right after allowing notifications | Built with `VITE_PUSH_ENABLED=true` but `google-services.json` missing (§3 A) | Add the file and rebuild — or rebuild with the flag unset |
| No permission prompt on launch | `VITE_PUSH_ENABLED` not set at build time, or permission previously denied | Set the flag + rebuild (§3 D); or phone Settings → Apps → Aviano AB → Notifications |
| No row in `device_push_tokens` | Missing `.env` at build time, or (Android) missing `google-services.json`, or emulator without Google Play | See §3 D / A / E |
| curl returns `401` | Wrong/missing `x-admin-key` | Check the secret value |
| curl returns `500 ...not configured` | Function secrets not set | §3 C last two commands |
| `sent:0, pruned:N` | All stored tokens were dead/invalid | Devices re-register on next app launch; iOS tokens are Apple-format until §4 is done |
| Android delivers, iOS doesn't | §4 not completed (APNs key / Firebase SDK) | Finish §4 |

_Last updated: 2026-07-07._
