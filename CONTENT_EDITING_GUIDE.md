# Aviano App — Content Editing Guide (No Coding Required)

> **Who this is for.** Anyone who needs to update the app's content — phone
> numbers, announcements, events, emergency info — and does **not** know how to
> code. You will not touch any code. You will edit small text files that hold
> the app's data, following recipes in this guide.
>
> If you ARE the technical maintainer, read `MAINTAINER_GUIDE.md` instead —
> this guide is deliberately simpler.

---

## The one idea you need

The app's screens and its information are kept **separate**. The screens are
code (leave those alone). The information lives in **five small text files** in
the folder:

```
src/content/
```

Change a file → save → publish (Section 6) → the app shows the new info.
That's the whole job. You never touch anything outside `src/content/`.

| To change… | Edit this file |
| --- | --- |
| Announcements on the Home screen | `src/content/announcements.json` |
| Phone book (Directory screen) | `src/content/directory.json` |
| Tap-to-call numbers on Emergency screen | `src/content/emergency-contacts.json` |
| ER address, map location, guidance text | `src/content/emergency-content.json` |
| Web links for LRS / Medical Group documents | `src/content/documents.json` |

*(The Calendar screen needs no edits — it shows the 31 FSS Google Calendar
live. See §4.)*

**Everything else in the project is off-limits.** If a file doesn't live in
`src/content/`, don't edit it. (Especially never touch a file called `.env` —
it holds secret keys.)

---

## 1. Reading the files: JSON in five minutes

The files are in a format called **JSON**. It looks intimidating; it's really
just labeled information in a strict pattern. Here is one real entry:

```json
{
  "id": "emergency-3",
  "label": "Off Base Emergency",
  "phone": "112",
  "category": "Emergency",
  "notes": "Italian single emergency number",
  "sort_order": 3
}
```

Read it as a form: each line is `"field name": value`. That's it.

### The five rules (JSON is strict — these prevent 95% of breakage)

1. **Text goes in double quotes.** `"phone": "112"` ✅ — not `phone: 112` ❌
2. **A comma after every line — EXCEPT the last one in a group.** The
   missing-or-extra comma is the #1 way people break these files:
   ```json
   {
     "label": "Fire Department",   ← comma: more lines follow
     "phone": "115"                ← NO comma: last line in the group
   }
   ```
3. **Entries are wrapped in `{ }` and the whole list in `[ ]`.** Between two
   entries there is a comma: `}, {`
4. **"No value" is written `null`** (no quotes): `"email": null`
5. **A line break inside text is written `\n`.** JSON text must stay on one
   line, so: `"notes": "Line one\nLine two"`

### Check your work before publishing (do this every time)

Go to **jsonlint.com**, paste the ENTIRE file's contents, click **Validate**.

- **"Valid JSON"** → you're safe to publish.
- **Error** → it tells you the line number. Almost always a comma or a quote.

Thirty seconds of checking prevents a broken app. Never skip it.

---

## 2. Recipes: Announcements (Home screen)

File: `src/content/announcements.json`. The Home screen shows the **3 newest
announcements** that have `"published": true`.

### Add an announcement

Copy an existing entry, paste it after a `},` and before the final `]`, then
change the values:

```json
{
  "id": "gate-closure-jul-2026",
  "title": "Main Gate closure",
  "body": "Main Gate closed 4 July 0900-1300 for the base ceremony.\nUse Area 1 Gate.",
  "created_at": "2026-07-04T08:00:00Z",
  "published": true
}
```

- **id** — any short unique text. A date-based slug like above is perfect.
- **created_at** — the date-time in this exact pattern:
  `YYYY-MM-DDTHH:MM:SSZ` (the `T` and `Z` are required; time is UTC/Zulu).
  Newest date shows first.
- **published** — `true` shows it; `false` hides it. (No quotes on true/false.)

### Take an announcement down

Change its `"published": true` to `"published": false`. Don't delete the entry
— unpublishing is reversible and keeps a record.

---

## 3. Recipes: Directory (phone book)

File: `src/content/directory.json`. This is the big one — every office, their
phones, emails, hours, locations.

### Change a phone number / hours / any detail

1. Open the file and use **Ctrl+F** to find the office by name.
2. Change just the value between the quotes. Touch nothing else.

### Add a new office

Copy an existing complete entry (from `{` to `}`), paste it after any `},`,
then edit every field:

```json
{
  "id": "new-office-2026",
  "name": "New Office Name",
  "category": "General Contact",
  "phone": "Main: 0434305000",
  "email": null,
  "hours": "Mon-Fri 0730-1630",
  "location": "Area 1, Building 100",
  "notes": null,
  "sort_order": 999,
  "url": null
}
```

Field notes:

- **name** and **category** are required; every other field may be `null`.
- **category** — reuse an existing category name EXACTLY (copy-paste it).
  The category filter on the Directory screen is built from these.
- **hours** — the app formats hours nicely if you follow the pattern
  `Mon-Fri 0730-1630` (three-letter days, dash for ranges, comma between
  different day rules, e.g. `Mon-Fri 0900-1600, Sat 0900-1200`). Anything
  else still displays, just as plain text.
- **phone** — you can list several: `"Main: 043430xxxx, DSN: 632xxxx"`.
- **url** — must start with `https://` to open correctly.

### Remove an office

Delete its entire entry from `{` to `}` — **including the comma that
separated it from its neighbor** (one comma must remain *between* any two
entries, none after the last). Then validate at jsonlint.com.

---

## 4. Recipes: Calendar

**Nothing to edit here.** The Calendar screen shows the **31 FSS Community
Calendar** directly from Google — it is maintained by FSS in Google Calendar,
not in this app. Whatever they publish appears automatically.

*(The app used to keep its own `events.json` list. It was removed in August
2026 in favor of the single FSS calendar. If you find references to
`events.json` in older notes, they're out of date.)*

---

## 4b. Recipes: Documents (PDFs and flyers)

File: `src/content/documents.json`.

The **LRS** and **Medical Group** screens list PDFs and info flyers — travel
memos, pet shipping rules, clinic notices. The files themselves are **not
inside the app**; they live on the base website, and this file tells the app
where to find each one.

Each line is `"filename": "web address"`. A file with an empty address shows
as **"Coming soon"** in the app instead of a broken link — that's the safety
net, and it's why an empty entry is never an emergency.

**To publish a document:**

1. Upload the PDF to the base website (whoever maintains it can do this).
2. Copy its full web address — it must start with `https://`.
3. Paste it between the quotes next to that filename:

```json
{
  "APRT_1679062320.pdf": "https://www.31fss.com/documents/APRT.pdf",
  "AvianoPetNonALetterCAO10June.pdf": ""
}
```

Above, the first document is live; the second still shows "Coming soon."

- **Don't rename the filenames on the left** — the app matches on them.
- The address must be reachable without a login, or people will hit a
  sign-in wall instead of the document.
- Tapping a document opens it in a browser window inside the app.

> **Why not put the PDFs in the app?** They add ~24 MB, and every correction
> would need a full app-store release. Linking means a corrected PDF is live
> the moment it's uploaded. The trade-off: documents need internet, while the
> directory and emergency screens keep working offline. Full reasoning is in
> `MAINTAINER_GUIDE.md` §10.

---

## 5. Recipes: Emergency screen

Two files. **Treat these with extra care — people rely on them in a crisis.**
Have a second person verify any number you change.

### `emergency-contacts.json` — the tap-to-call list

Same pattern as the directory: `label`, `phone`, `category`, `notes`,
`sort_order` (lower number = higher on screen).

### `emergency-content.json` — ER info and guidance text

Simple label/value pairs: `er_name`, `er_address`, `er_lat`, `er_lng` (map
coordinates), and `guidance` (the advice paragraph; use `\n\n` between
paragraphs).

---

## 6. Publishing your change

Editing the file changes nothing until it's published through Git (the
project's save-and-share system).

**If you have the project on your computer** — in a terminal, from the project
folder:

```
git pull
git status
git add src/content
git commit -m "Update CDC phone number"
git push
```

(Write a real description in the quotes — it becomes the permanent record of
what changed.)

**If you don't have the project set up locally**, you can edit entirely in the
web browser: go to the repository on **github.com**, open the file under
`src/content/`, click the **pencil icon**, make your change, and click
**Commit changes**. Easiest path for occasional editors — nothing to install.

After publishing, the app updates when it is next built/deployed — the
maintainer can tell you the current cadence.

---

## 7. If you break something — don't panic

- **The app looks wrong / a screen is blank after your change:** the file
  almost certainly has a JSON error. Paste it into jsonlint.com, fix the line
  it points at, publish again.
- **You can't find the mistake:** every previous version is saved forever in
  Git. Tell the maintainer "please roll back my last change" — it's a
  one-command fix. You cannot permanently destroy anything.
- **Golden rule:** small changes, one at a time, validate before publishing.

---

## Quick reference card

| Task | File | Key detail |
| --- | --- | --- |
| Post announcement | `announcements.json` | `"published": true`, date newest-first |
| Hide announcement | `announcements.json` | `"published": false` |
| Change a phone number | `directory.json` | Ctrl+F the office name |
| Add an office | `directory.json` | copy an entry, keep category exact |
| Publish a PDF/flyer | `documents.json` | paste the `https://` address; empty = "Coming soon" |
| Emergency numbers | `emergency-contacts.json` | double-check with a second person |
| ER / guidance text | `emergency-content.json` | `\n\n` between paragraphs |
| Validate | jsonlint.com | every time, before publishing |

_Last updated: 2026-08-04._
