# Site content

This folder holds the editable content for the app. Public Affairs can
update these JSON files directly — no login or database access required.
The site re-reads them on every build/deploy.

## Files

- `announcements.json` — Home page announcements. Set `"published": true`
  for a card to appear. Newest first by `created_at` (ISO 8601 UTC).
- `directory.json` — Phone book entries. Grouped by `category`, sorted by
  `sort_order` within each category. Any field except `name` and
  `category` may be `null` or omitted.
- `emergency-contacts.json` — Tap-to-call list on the Emergency page.
- `emergency-content.json` — Free-form key/value strings used on the
  Emergency page (`er_name`, `er_address`, `er_lat`, `er_lng`,
  `guidance`).

## Editing tips

- `id` values can be any unique string. A UUID is fine; so is a short
  slug like `"cdc-1"`. They only need to be unique within their file.
- Multi-line text (notes, descriptions, guidance): use `\n` for a
  newline inside a JSON string.
- After saving, commit and deploy — the site will rebuild with the new
  content.