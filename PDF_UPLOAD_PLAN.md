# Documents: where they came from, and how to update them

> **Status: complete.** All 85 documents the app references are recovered and
> bundled inside the app. Nothing needs uploading to a website.
>
> This file previously planned an AFPIMS upload effort. That is no longer
> needed — the history is kept at the bottom because the reasoning still
> applies if the decision is ever revisited.

---

## 1. Where the documents came from

The 31 FW's **AF Connect** app (the one this app replaces) is managed through
a CMS at `af.m360connect.com`, and its uploaded files live in a public
AWS GovCloud bucket:

```
https://s3-us-gov-west-1.amazonaws.com/afconnectcms/uploads/1064/images/thumb/references/pdf/<FILENAME>
```

`1064` is the 31 FW's instance. Despite `thumb` in the path, these are the
**full-resolution originals** (the pharmacy flyer is 2245×1587).

That is how the 33 Medical Group flyers and the last 7 LRS PDFs were
recovered on 2026-09-02, after they were assumed lost — they only ever
existed on Lovable's CDN in our copy, but the originals were still published
by the wing.

**If a document is ever missing again**, look there first. To find the exact
filenames for a section, open the CMS module editor:

```
https://af.m360connect.com/features/references/index.php?mid=<MODULE>&smid=<SECTION>
```

31 MDG is `mid=6009`. The page's HTML contains the S3 URLs for every file in
that section.

> **Names drift.** The ADAPT flyer had been renamed upstream from
> `AFConnectADAPT.jpg` to `AFConnectADAPTPROGRAMwledits.jpg`. If a filename
> 404s, open the section in the CMS and read the current name rather than
> assuming the file is gone.

## 2. How documents work in the app now

- The files live in **`public/documents/`**, bundled into the app.
- **`src/content/bundled-documents.json`** maps each document name to its
  web-safe filename. Regenerated whenever documents change.
- **`src/content/documents.json`** holds an optional web URL per document,
  used only for anything *not* bundled.
- **`src/lib/documents.ts`** prefers the bundled copy, falls back to the URL,
  and returns nothing when neither exists — which makes the pages show
  "Coming soon" rather than a dead link.
- **`src/routes/document.tsx`** renders them: PDFs through pdf.js (Android's
  webview cannot display a PDF on its own), images through a plain `<img>`.

Everything works with no signal. See `MAINTAINER_GUIDE.md` §10.

## 3. To add or replace a document

1. Put the file in the right folder under `downloads/`.
2. Re-run the bundling step (ask an AI session, or copy it into
   `public/documents/` with a lowercase-hyphenated name and add the entry to
   `bundled-documents.json`).
3. `npm run build && npx cap sync`, then ship a store update.

A replaced document reaches phones only via an app update. That is the
accepted trade-off for offline access — the reasoning is in
`MAINTAINER_GUIDE.md` §10.

---

## 4. Historical: the AFPIMS upload plan (not needed)

Before the documents were recovered, the plan was to publish them on the base
website and link to them. Two things worth keeping from that analysis if the
decision is ever reopened:

- **Section 508.** Public `.mil` sites must meet accessibility standards. A
  scanned PDF with no text layer generally cannot be posted. Several of these
  are scans, so publishing them would have needed OCR or replacements first.
- **AFPIMS URLs carry a `?ver=` token** that changes when a file is replaced,
  so any re-upload means re-copying the URL.

Neither applies while the documents ship inside the app.

_Last updated: 2026-09-02._
