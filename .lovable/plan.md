# Aviano Air Base App — Plan

A Progressive Web App (installable on iOS + Android home screens) for Aviano Air Base members, with an admin CMS and broadcast push notifications. Future-ready for a Capacitor wrapper if you decide to submit to the App Store / Play Store.

## Tech Stack
- TanStack Start (React) + Tailwind
- Lovable Cloud (Postgres, Auth, Storage, server functions)
- Web Push via VAPID (`web-push` library) for Android + installed iOS PWAs
- Manifest + icons for "Add to Home Screen"; minimal service worker for push only (no offline caching to avoid stale content)

## Public-facing app (no login required)

**Home tab** — base seal, welcome, latest 3 announcements, quick links to Emergency tab, prompt to install + enable notifications.

**Directory tab** — searchable list of base services (e.g. Housing, MPF, Med Group, Commissary, BX). Each entry: name, category, phone (tap to call), email, hours of operation, location, notes.

**Calendar tab** — toggle between Operational and Recreational events. Month + list views. Each event: title, type, start/end, location, description.

**Emergency tab** (always one tap away, red accent):
- Aviano AB Fire, Security Forces (Police), Medical — tap-to-call
- Italian emergency services: **112** (single Italian emergency number), 113 Police, 115 Fire, 118 Medical
- Tricare referrals number (tap-to-call)
- Pordenone Hospital ER: address + embedded map + "Open in Google Maps / Apple Maps" buttons + ER phone
- Static guidance text (editable by admin)

**Install + Notifications banner** — explains how to add to home screen on iOS (Share → Add to Home Screen) and Android (browser install prompt), then asks permission to receive alerts.

## Admin CMS (`/admin`, login required)

Email/password login (admins seeded by you). Admins can:
- Create / edit / delete directory entries
- Create / edit / delete calendar events (operational vs recreational)
- Edit emergency tab content (numbers, addresses, guidance text)
- Compose and send push notifications with title + body + optional link (e.g. "Main Gate closed until 1800")
- View notification history

## Database (Lovable Cloud)

- `directory_entries` — name, category, phone, email, hours, location, notes
- `events` — title, type (operational | recreational), starts_at, ends_at, location, description
- `emergency_contacts` — label, phone, category, sort_order
- `emergency_content` — singleton key/value (ER address, map coords, guidance text)
- `announcements` — title, body, published_at
- `push_subscriptions` — endpoint, p256dh, auth keys (per device)
- `notifications` — title, body, link, sent_at, sent_by
- `user_roles` — separate roles table with `admin` enum (security best practice)
- RLS: public read on content tables; writes restricted to admins via `has_role()` security-definer function

## Push notifications

- Generate VAPID keypair; public key shipped to client, private key stored as secret
- Service worker (`/sw.js`) handles `push` and `notificationclick` events only — no caching
- Subscribe flow: request permission → register SW → save subscription to `push_subscriptions`
- Admin "Send notification" calls a server function that fans out via `web-push` to all subscriptions, prunes expired ones

## Secrets needed
- `VAPID_PUBLIC_KEY` (also exposed as `VITE_VAPID_PUBLIC_KEY`)
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT` (your admin email, `mailto:...`)

## Out of scope (call out)
- Native App Store / Play Store submission — requires Capacitor wrapping done outside Lovable
- iOS push only works after the user installs the PWA to home screen (iOS limitation, not ours)
- SMS / email fallbacks for notifications

## Suggested build order
1. Enable Lovable Cloud, set up schema + RLS + roles
2. Public shell: nav, Home, Directory, Calendar, Emergency (with seeded content)
3. Admin auth + CMS for all content types
4. PWA manifest + install banner
5. Push subscription flow + admin send-notification UI + server fan-out
6. Polish (search, filters, map embed, accessibility, dark mode)
