# Editing the App — The Safe Workflow

> **Who this is for.** The maintainer making changes — from a phone number to
> screen text to a new quick-link. Pairs with `READING_THE_CODE.md` (how to
> read what you're editing) and `CONTENT_EDITING_GUIDE.md` (data-only edits).

---

## 0. First question: is it a CONTENT edit?

**Phone numbers, announcements, events, emergency info → you don't need this
guide.** Use `CONTENT_EDITING_GUIDE.md` — those are JSON edits in
`src/content/` and they're the majority of all maintenance. This guide is for
everything beyond that.

## 1. The universal editing loop

Every change, no matter how small, follows the same five steps:

```
1. git pull                      get the latest before touching anything
2. edit the file(s)              in any text editor (VS Code recommended)
3. PREVIEW —  npm run dev        see your change before publishing (see §2)
4. git add … / git commit -m     snapshot with a clear message
5. git push                      publish to GitHub
```

Then, when you want the change **on phones**: rebuild and re-sync the wrapper
(§5) and ship a store update.

## 2. Previewing your change (verified to work on this machine)

From the project folder in a terminal:

```
npm run dev
```

Wait a few seconds; it prints `Local: http://localhost:8080/`. Open that in
your browser — it's the app, live. **It auto-refreshes as you save files**, so
keep it open while you edit. Stop it with `Ctrl+C` in the terminal.

> Never skip the preview. The rule is: **see it work, then commit.**

## 3. Recipes for common UI edits

### Change text on a screen

1. Find the screen in `src/routes/` (Home = `index.tsx`).
2. `Ctrl+F` for the exact text you see in the app.
3. Change only the words between the tags: `<p>old words</p>` → `<p>new words</p>`.
4. Preview, commit.

### Change a link (e.g., the "Newcomers" button)

Links look like `<a href="https://31fss.com/...">`. Change only the URL inside
the quotes. External links need the full `https://`.

### Add a Quick Link tile to the Home screen

In `index.tsx`, find the block of `<QuickLink … />` lines. Copy one line,
paste it below, and change its three parts:

```tsx
<QuickLink to="/housing" icon={<Home className="size-5" />} label="Housing" />
```

- `to=` — the page it opens (must be an existing route)
- `icon=` — pick any icon name from **lucide.dev/icons**, then add that name
  to the `import { … } from "lucide-react"` line at the top of the file
- `label=` — the words on the tile

### Change colors / spacing

Styling is Tailwind classes inside `className="…"` — see the decoder table in
`READING_THE_CODE.md` §3. Change one class at a time and watch the preview.

## 4. The boundaries (what NOT to edit)

- `src/routeTree.gen.ts` — auto-generated, overwritten on every build.
- `src/components/ui/` — shared library; editing one piece changes every
  screen that uses it, usually by surprise.
- `src/integrations/supabase/`, `src/server.ts`, `src/start.ts` — plumbing;
  the app boots through these.
- `.env` — secrets. Never edit casually, never commit, never screenshot.
- `dist/`, `node_modules/` — machine-generated; changes there are erased.

A bigger change than these recipes (new screen, new feature)? Read
`HOW_THE_APP_WORKS.md` first, work on it with an AI assistant, and make small
commits as you go.

## 5. Getting changes onto phones (the wrapper)

Committing to GitHub updates the *code*, not the apps on people's phones.
When you're ready to ship:

```
npm run build            # rebuild the static site with your changes baked in
npx cap sync android     # copy it into the Android project
```

Then build/upload the new release from Android Studio (and Xcode on the Mac
for iOS). Store updates take effect after review — plan announcements around
that lag, not around your push.

## 6. If something goes wrong

`TROUBLESHOOTING.md` has a symptom → fix table, including how to roll back
any change. Short version: **you cannot permanently destroy anything that was
committed** — every version is recoverable.

_Last updated: 2026-07-06._
