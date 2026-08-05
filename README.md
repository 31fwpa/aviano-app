# Aviano Air Base

The official mobile app for Aviano Air Base members — directory, calendar,
housing, PA channels, Security Forces, Medical Group, LRS, and emergency
information. Built as an offline-first web app, wrapped with Capacitor for the
Apple App Store and Google Play.

- **Repo:** `github.com/31fwpa/aviano-app` · **App ID:** `mil.af.aviano`
- **Stack:** React (TanStack Start) · Tailwind · static JSON content ·
  Capacitor wrapper · Supabase (push, planned)

---

## 📚 Start here — the guides

This project is documented for maintainers **who are not programmers.** Pick
the guide that matches what you need right now:

| You want to… | Read |
| --- | --- |
| **Take over this project** (new maintainer — start here) | [`SETUP_NEW_COMPUTER.md`](SETUP_NEW_COMPUTER.md), then [`MAINTAINER_GUIDE.md`](MAINTAINER_GUIDE.md) |
| Update a phone number, announcement, or event | [`CONTENT_EDITING_GUIDE.md`](CONTENT_EDITING_GUIDE.md) |
| Understand how the app is put together | [`HOW_THE_APP_WORKS.md`](HOW_THE_APP_WORKS.md) |
| Learn to read the code files | [`READING_THE_CODE.md`](READING_THE_CODE.md) |
| Change screens, text, links, or styling | [`EDITING_THE_APP.md`](EDITING_THE_APP.md) |
| Fix something that broke | [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) |
| Finish setting up / send push notifications | [`PUSH_NOTIFICATIONS.md`](PUSH_NOTIFICATIONS.md) |
| Put the app on real phones for testing | [`TEST_DEVICE_INSTALL.md`](TEST_DEVICE_INSTALL.md) |
| Know the Git workflow, decisions, and app-store roadmap | [`MAINTAINER_GUIDE.md`](MAINTAINER_GUIDE.md) |

## 🗺️ Project status (2026-07-07)

- ✅ App content & screens complete; offline-capable static build working
- ✅ Capacitor Android wrapper generated (`android/`)
- ✅ Capacitor iOS wrapper generated (`ios/`, Swift Package Manager —
  simulator build verified)
- ✅ Both platforms verified compiling (iOS simulator build + Android debug APK)
- ⬜ Play Store signing + submission · App Store signing + submission
- 🟨 Push notifications — **code complete** (app registration, database,
  Edge Function sender); needs the account-based setup in
  [`PUSH_NOTIFICATIONS.md`](PUSH_NOTIFICATIONS.md) (Firebase, Supabase
  deploy, APNs key)
- ❌ Spouse/CAG calendar integration — **dropped** (2026-08-04). The Calendar
  screen shows the 31 FSS calendar only.

## 🤖 Maintaining this with an AI assistant

This app was built and documented in partnership with an AI coding assistant,
and it's designed to be maintained that way. If you're stuck: open the project
folder with an AI tool (e.g. Claude Code), and ask it to read these guides
first. Useful prompts: *"Read the guides in this repo, then explain X"* ·
*"Walk me through this error"* · *"Guide me through this change step by step —
don't change code without telling me why."* Never share the `.env` file's
contents with anything or anyone.

## ⚠️ The three unbreakable rules

1. **Never commit `.env`** or any secret. (`.gitignore` protects it — leave
   that protection alone.)
2. **Never keep this project inside OneDrive** or any cloud-synced folder.
3. **Pull before you work; preview before you commit; write real commit
   messages.**
