# Troubleshooting — When Something Goes Wrong

> **First: breathe.** Two facts before any fix: (1) every committed version of
> this project is permanently recoverable — you cannot destroy history; and
> (2) almost every problem below has a two-minute fix. Work the table, don't
> guess.

---

## 1. Symptom → fix table

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Screen is blank / app broken **right after a content edit** | Broken JSON (a comma or quote) | Paste the whole file into **jsonlint.com**; fix the line it names |
| `git push` rejected: *"remote contains work you do not have"* | Someone else pushed first | `git pull`, resolve if asked, then `git push` again. Pull before you start next time |
| `git pull` refuses: *"your local changes would be overwritten"* | You have uncommitted edits | Commit them first (`git add …` / `git commit`), then pull |
| `git commit` says *"nothing to commit"* | Already committed, or forgot `git add` | `git status` tells you which; `git log --oneline -3` shows recent commits |
| Terminal suddenly shows a strange full-screen editor after `git commit` | Forgot the `-m "message"` — Git opened the Vim editor | Type `:q!` then Enter to escape unharmed. Re-run with `-m "your message"` |
| `npm install` fails: *"Unsupported platform: win32 arm64"* (`workerd`) | ARM Windows machine + an unused Cloudflare dependency | Use `npm install --ignore-scripts` (see `SETUP_NEW_COMPUTER.md` §5) |
| `Deletion of directory .git/objects/... failed` during Git commands | The project is inside OneDrive/Dropbox | Move it out — see the OneDrive warning in `MAINTAINER_GUIDE.md` §2 |
| `npm run dev` or `npm run build`: *"command not found"* / module errors | Dependencies not installed on this machine | Run `npm install --ignore-scripts` in the project folder |
| `npm install` fails: *"EACCES: permission denied"* mentioning `~/.npm` (Mac) | npm was once run with `sudo`, leaving root-owned files in its cache | Run `sudo chown -R $(whoami) ~/.npm` once, then retry |
| Change committed + pushed but **phones don't show it** | Store apps only update via releases | Rebuild + sync + ship a store update (`EDITING_THE_APP.md` §5) |
| Android app **crashes at launch** after allowing notifications | Push enabled at build time without Firebase config | See `PUSH_NOTIFICATIONS.md` §6 (first row) |
| App works in preview but a page 404s after deploy | Route file renamed/removed | `git log --oneline -- src/routes` to see what changed; revert it |

## 2. Rolling back a bad change (the undo button)

**Scenario:** a change was pushed and something's wrong. You want the previous
version back.

1. Find the bad commit:
   ```
   git log --oneline -10
   ```
   Each line: `abc1234 The message`. Identify the one that broke things.
2. Reverse exactly that commit (creates a NEW commit that undoes it — history
   stays intact, nothing is erased):
   ```
   git revert abc1234
   git push
   ```
3. Done. If unsure **which** commit broke it, see what each one touched:
   ```
   git log --stat -5
   ```

> Prefer `git revert` over anything with the word "reset" or "force." Revert
> is the safe, reversible undo. If you find yourself about to type
> `git reset --hard` or `git push --force` — stop and get help first.

## 3. Recovering one file's old version

Wrong edit to a single file (say, `directory.json`), everything else fine:

```
git log --oneline -- src/content/directory.json     ← that file's history
git checkout abc1234 -- src/content/directory.json  ← pull the old version
git add … / git commit -m "Restore directory.json" / git push
```

## 4. "I have no idea what state I'm in"

Run these three read-only commands and read their output slowly — they answer
90% of confusion and change nothing:

```
git status          what's modified / staged / untracked right now
git log --oneline -5   the last five snapshots
git remote -v       where "push" and "pull" point
```

## 5. Getting help

- **An AI assistant** (Claude, etc.): paste the exact error message and say
  what you were doing. This is how the first maintainer solved nearly every
  problem in this table. Never paste the contents of `.env`.
- **GitHub's website** shows every file's full history (repo → file →
  History) — useful to see exactly what a change did, from any browser.
- If a command's outcome scares you, **stop before running more commands** —
  most damage comes from panicked follow-ups, not the original mistake.

_Last updated: 2026-07-06._
