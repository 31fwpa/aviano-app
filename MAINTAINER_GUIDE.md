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
6. [How the app is built _(to be written)_](#6-how-the-app-is-built)
7. [Editing content (phone numbers, events, etc.) _(to be written)_](#7-editing-content)
8. [Deploying / publishing changes _(to be written)_](#8-deploying--publishing-changes)
9. [Glossary](#9-glossary)

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

_(To be written.)_ This section will explain how the files fit together — the
routes/screens, where the data lives, and which files are safe to edit vs. which
are auto-generated and should be left alone.

---

## 7. Editing content

_(To be written.)_ This section will cover the day-to-day task: updating phone
numbers, directory entries, calendar events, and emergency info — and which data
files to change.

---

## 8. Deploying / publishing changes

_(To be written.)_ This section will explain what happens after you push — how a
change actually reaches the live app that base members see.

---

## 9. Glossary

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

_Last updated: 2026-06-25. Add your name and the date when you edit this guide._
