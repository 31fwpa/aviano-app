# Setting Up a New Computer (PCS-Proofing)

> **Who this is for.** A new maintainer starting from a bare Windows machine —
> the most likely handoff scenario. Follow top to bottom; ~45 minutes.

---

## 1. Install the tools

1. **Git** — git-scm.com → download → install with default options.
2. **Node.js** — nodejs.org → the **LTS** version → default options.
3. **VS Code** (recommended editor) — code.visualstudio.com.
4. *(Only when doing store releases)* **Android Studio** — developer.android.com.

## 2. Tell Git who you are (once per machine)

```
git config --global user.name  "Your Name"
git config --global user.email "your-github-email@example.com"
```

Use the email tied to your GitHub account.

## 3. Get access

1. Create a GitHub account (or use your existing one).
2. Have the outgoing admin (or org owner) add you to the **`31fwpa`**
   GitHub organization and grant you access to the **`aviano-app`** repo.
3. Accept the invitation (check email / github.com notifications).

## 4. Download the project

> **⚠️ NOT inside OneDrive, Dropbox, or any cloud-synced folder.** Git and
> sync tools corrupt each other. Use a plain local path.

```
cd C:\Users\YOURNAME
mkdir dev
cd dev
git clone https://github.com/31fwpa/aviano-app.git AvianoApp
cd AvianoApp
```

A browser window will pop up to log you into GitHub the first time — that's
normal (it's Git Credential Manager).

## 5. Install the project's dependencies

```
npm install --ignore-scripts
```

> **Why `--ignore-scripts`?** One buried dependency (`workerd`, part of an
> unused Cloudflare pathway) has no version for Windows-ARM machines and
> breaks a plain `npm install`. Skipping install scripts avoids it and costs
> nothing — the app builds and runs fine. On a regular Intel/AMD machine a
> plain `npm install` also works; using the flag everywhere keeps it simple.

## 6. Verify everything works

```
npm run dev
```

Open the printed address (usually `http://localhost:8080`) — you should see
the app. `Ctrl+C` to stop. Then prove the build works too:

```
npm run build
```

It should end with `Prerendered 1 pages` and no errors.

## 7. The things GitHub does NOT give you (handoff checklist)

Cloning gets you all the **code**. These must be transferred person-to-person:

| Item | Why it's not in Git | How to get it |
| --- | --- | --- |
| **`.env` file** | Holds secret keys — deliberately excluded | Securely copied from the outgoing admin, or regenerate the keys |
| **GitHub org ownership** | Account-level | Outgoing admin transfers before losing access |
| **Supabase project access** | Account-level | Same |
| **Apple Developer & Google Play accounts** | Office-held | Get credentials/roles from whoever administers them |
| **Android signing keystore** (once created) | Secret file — losing it means you can never update the Play Store app | Securely handed off + backed up somewhere safe |
| **Lovable account** (original builder tool) | Account-level | Same |

> **The keystore warning is not theoretical.** Google Play permanently ties
> the app to its signing key. Treat the keystore file + its password like the
> app's birth certificate.

_Last updated: 2026-07-06._
