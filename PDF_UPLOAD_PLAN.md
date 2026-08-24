# Plan: Publishing the App's Documents on AFPIMS

> **Goal.** Get the LRS / Medical Group / Security Forces documents onto the
> base website so the app can link to them. Until a document has a URL, the
> app shows "Coming soon" — which is safe, so this can be done in batches
> rather than all at once.
>
> **Read first:** `CONTENT_EDITING_GUIDE.md` §4b (how a URL reaches the app)
> and `MAINTAINER_GUIDE.md` §10 (why we link instead of bundling).

---

## 1. Where things actually stand

| | Count |
| --- | --- |
| Documents the app expects a URL for | **85** (52 PDFs + 33 images) |
| PDFs downloaded and filed in `downloads/` | **60** |
| App keys with a confident file match | **21** |
| App keys where the match needs a human eye | **18** |
| App keys with **no file on hand** | **13** |
| MDG images (flyers/slides) not downloaded at all | **33** |
| PDFs on disk that matched no app key | **29** |

**The catch that makes this more than "upload 60 files":** the app refers to
each document by the filename Lovable gave it (`APRT_1679062320.pdf`), while
the files you downloaded have human names (`AF Form 972, Emergency Leave
Order.pdf`). **Exactly one filename matches by accident.** So the real work is
deciding which file answers to which app key — the uploading itself is the
easy half.

Two artifacts are ready for that:

- **`downloads/UPLOAD-WORKSHEET.csv`** — one row per app key, with the
  best-guess local file, a confidence flag, and a blank column for the URL.
  This is the working document for the whole effort.
- **`downloads/UNREFERENCED-FILES.txt`** — the 29 PDFs no key matched. Some
  are for pages that don't link them yet (Soggiorno, Key Spouse); some are
  duplicates under a different name.

---

## 2. Before uploading anything: two blockers to clear

### a. Section 508 accessibility — check this first

Public `.mil` sites must meet Section 508. A scanned PDF with no text layer
is an image of a document and generally **cannot be posted**. A good share of
these (signed memos, forms) are likely scans.

**Do this before bulk-uploading:** open five or six of the memo-style PDFs and
try to select text. If you can't, they need OCR or an accessible replacement,
and that conversation belongs with whoever owns 508 review in your office
*before* you upload 60 files and get asked to take them down.

This is the single most likely reason this plan stalls, which is why it's
step one rather than a footnote.

### b. Public release review

These came from LRS/MDG originals. Confirm each is cleared for public posting
— some travel and medical documents carry distribution limits. Your office
does the review, but it needs to happen deliberately, not by assumption.

---

## 3. The AFPIMS specifics that will bite you

1. **Rename files before uploading.** Spaces, `&`, and parentheses become
   `%20`, `%26`, `%28` in the URL — fragile and ugly. Rename to lowercase
   with hyphens: `af-form-972-emergency-leave-order.pdf`.
2. **Capture the URL immediately after each upload.** AFPIMS URLs look like
   `https://www.aviano.af.mil/Portals/<n>/documents/<file>.pdf?ver=<token>`.
   Paste it into the worksheet *as you go*. Recovering 60 URLs afterwards by
   hunting the document manager is miserable and error-prone.
3. **Replacing a file changes its `?ver=` token.** If a document is ever
   re-uploaded, re-copy the URL and update `documents.json` — otherwise the
   app can end up pointing at a stale version.
4. **Use one consistent folder** in the document manager (e.g. `app-docs/`)
   so these stay separable from the rest of the site's media.
5. **Upload is one file at a time.** Budget the time; see §5.

---

## 4. The sequence

### Step 1 — Resolve the mapping (desk work, no AFPIMS)

Open `downloads/UPLOAD-WORKSHEET.csv`. Work the `status` column:

- `CONFIRMED (exact)` — leave alone.
- `LIKELY — verify` (18 rows) — open the file, confirm it's really that
  document, fix `local_file` if not.
- `MISSING — no file on disk` (13 rows) — either find the file, or leave the
  row blank and accept "Coming soon" for now.
- `IMAGE — not downloaded` (33 rows) — see §6.

**Do not edit the `app_key` column.** Those strings are baked into the page
code; changing one silently breaks that link.

### Step 2 — Rename and stage

Rename the confirmed files web-safe (§3.1). Keep them in the folder structure
already built under `downloads/` — it mirrors how the app groups them, which
makes the upload order obvious.

### Step 3 — Upload in priority order

Don't start at "A". Start with what people actually need, so partial progress
is still useful:

1. **31 SFS** — Installation Access Request (2 files). Highest traffic:
   every visitor and contractor needs it.
2. **Housing** — rental agreement, condition inventory (4 files). Every PCS
   in.
3. **LRS Personal Property** — required documents, claims, weight allowances
   (14 files). The bulk of PCS questions.
4. **LRS Passenger Travel** — pet travel, emergency leave, circuitous
   (~30 files). Large but lower urgency.
5. **31 MDG** (6 files) and the rest.

Paste each URL into the worksheet as you upload.

### Step 4 — Put the URLs into the app

Copy each URL from the worksheet into `src/content/documents.json` next to
its `app_key`. This is a **content edit** — the recipe is
`CONTENT_EDITING_GUIDE.md` §4b. Validate the JSON at jsonlint.com before
committing; a stray comma breaks the build.

### Step 5 — Verify, then ship

Ask an AI session (or run yourself) `npm run dev`, open `/lrs` and
`/medical-group`, and confirm the uploaded documents now show as links
instead of "Coming soon" — and that each one opens. Then rebuild and ship a
store update so phones get the new links.

---

## 5. Realistic effort

| Step | Time |
| --- | --- |
| 508 triage (§2a) | 1 hour, plus whatever remediation it triggers |
| Resolving the 18 uncertain matches | ~1 hour |
| Renaming + uploading 60 files | 3–4 hours (≈3 min each in AFPIMS) |
| Pasting URLs + verifying | 1 hour |

**Split it across sessions by section.** The app degrades gracefully, so
uploading SFS and Housing today and LRS next week costs nothing — each batch
goes live for users as soon as its URLs land in `documents.json`.

---

## 6. The 33 missing images

The Medical Group page also links flyers and slides (`AFConnectRadiology.jpg`,
`JuneClosures.png`…). None were downloaded — they only ever existed on
Lovable's CDN.

Two options, in order of preference:

1. **Ask 31 MDG for the originals.** They produced these; they'll have
   current versions, and the ones we had are already months old (a "June
   Closures" flyer is stale by definition).
2. **Re-export them from Lovable** if the project is still accessible.

Until then those items show "Link pending" in the app, which is honest and
harmless. Given several are dated notices, **option 1 is genuinely better than
recovering the old files** — don't spend effort restoring flyers that have
expired.

---

## 7. If AFPIMS turns out to be the wrong home

If 508 review or posting policy blocks these, the alternative is
**`31fss.com`** — the app already links there for directory entries, so it's
an established pattern and FSS controls it directly. The plan is otherwise
identical; only the URLs change. Nothing in the app assumes a particular
host.

_Last updated: 2026-08-17._
