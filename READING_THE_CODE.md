# Reading the Code — A Primer for Non-Programmers

> **Who this is for.** An airman who inherits this app and needs to *read* the
> code — to find things, understand what a screen does, and follow a change —
> without being a programmer. Reading code is a much smaller skill than writing
> it, and it's 90% of what maintenance requires.

---

## 1. The reassurance

This app is made of three things you may already half-know:

- **HTML** — the structure of a page (`<div>`, `<h1>`, `<a>`)
- **CSS** — how it looks (colors, spacing, fonts)
- **JavaScript** — behavior (what happens when you tap or search)

Everything else is organization around those three. You never need to
understand all of it — you need to recognize the patterns below.

## 2. The file types

| Ends in | What it is | Will you read it? |
| --- | --- | --- |
| `.json` | Pure data (phone numbers, events) | Yes — most edits happen here |
| `.tsx` | A screen: JavaScript + HTML mixed | Yes — to understand screens |
| `.ts` | JavaScript logic, no visuals | Rarely |
| `.css` | Styling | Almost never (styles live in the `.tsx` files here) |
| `.md` | Documentation like this file | Yes |

**The key file type is `.tsx`.** It is JavaScript that is allowed to contain
two extras: **type labels** and **HTML tags**.

### Trick #1: mentally delete the type labels

TypeScript adds labels that say what kind of value something is, like C-style
declarations: `name: string` means "name is text." When reading, **ignore
everything after a colon in a declaration** and you're reading plain
JavaScript:

```tsx
// What's written:            // What to read:
const title: string = "Hi";   const title = "Hi";
```

### Trick #2: the HTML inside is just HTML

```tsx
function Index() {
  return (
    <div>
      <h1>Aviano Air Base</h1>
    </div>
  );
}
```

A screen is a **function that returns HTML**. That's the whole idea of React.
Two renames to know:

- `className=` is HTML's `class=` (renamed because `class` is a reserved word
  in JavaScript).
- `<Button>` with a **capital letter** is not standard HTML — it's a reusable
  piece defined elsewhere in this project (see `src/components/ui/`). Think
  of it as a custom rubber stamp.

## 3. Decoding the styling (Tailwind)

The `className` strings are **Tailwind CSS** — tiny abbreviations for CSS
rules, applied inline. A decoder for the ones this app uses constantly:

| Class | Means |
| --- | --- |
| `px-5` / `py-6` | padding left-right / top-bottom (bigger number = more) |
| `mt-2` / `mb-4` | margin top / bottom |
| `text-sm` / `text-2xl` | font size small / extra large |
| `font-bold` / `font-medium` | font weight |
| `text-muted-foreground` | the app's gray "secondary text" color |
| `bg-card` / `bg-destructive` | background: card color / danger red |
| `flex items-center gap-3` | line children up in a row, centered, spaced |
| `grid grid-cols-2 gap-3` | two-column grid |
| `rounded-lg border` | rounded corners, thin outline |

You don't memorize these — you pattern-match. `text-` is about text, `bg-` is
background, numbers are sizes. Full reference: **tailwindcss.com/docs**.

## 4. Decoding the JavaScript-in-HTML: `{ }`

Inside the HTML, **curly braces mean "a JavaScript value goes here"**:

```tsx
<p className="font-medium">{a.title}</p>
```

…means "print this announcement's title here." Three patterns cover nearly
everything in this app:

**Pattern 1 — insert a value:** `{e.phone}` → show the phone number.

**Pattern 2 — repeat for each item (`.map`)** — this is the app's workhorse:

```tsx
{announcements.map((a) => (
  <Card key={a.id}> ... </Card>
))}
```

Read: "for each announcement `a`, stamp out one Card." This is how one JSON
file becomes a whole list on screen.

**Pattern 3 — show only if (`&&` and `? :`):**

```tsx
{e.phone && <a href={`tel:${e.phone}`}>...</a>}
```

Read: "if this entry has a phone number, show the tap-to-call link;
otherwise show nothing." And `condition ? A : B` reads "if condition, A,
otherwise B."

## 5. Anatomy of a screen file

Every file in `src/routes/` has the same skeleton. Open
`src/routes/index.tsx` (the Home screen) and match it to this:

```
1. import lines          ← the parts this screen uses (icons, Cards, data)
2. export const Route    ← registers this file as a page (URL = filename)
3. function ScreenName() ← the screen itself
     - a little logic    (filter/sort the data)
     - return ( ...JSX ) ← the HTML that appears
```

That's it. Every screen. Once you can read one, you can read all of them.

## 6. A guided reading exercise (15 minutes)

Open `src/routes/index.tsx` next to this guide:

1. **Lines 1–7 (imports):** spot where the announcements data comes from —
   `announcements.json`. Data and screen are separate files on purpose.
2. **Line ~14:** `.filter((a) => a.published)` — read it aloud: "keep only
   published announcements." `.sort(...)` — newest first. `.slice(0, 3)` —
   take the first three. That's why the Home screen shows 3 announcements.
3. **The `return (`:** skim the tags. `<header>`, `<h1>`, buttons linking to
   `/emergency` and `/directory`. You can already see the whole screen.
4. **Find the `announcements.map(...)`** — Pattern 2 above. One Card per
   announcement.

If you followed that, you can read this codebase.

## 7. If you want to go deeper (optional, free)

- **JavaScript basics:** developer.mozilla.org (MDN) — the standard reference
- **React (the screen system):** react.dev/learn — first three chapters
- **Tailwind (the styling):** tailwindcss.com/docs
- Or ask an AI assistant (Claude, etc.) to explain any file line by line —
  that is exactly how the first maintainer learned this codebase.

_Last updated: 2026-07-06._
