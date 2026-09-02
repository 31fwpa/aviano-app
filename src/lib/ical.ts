/**
 * Minimal iCalendar (RFC 5545) reader for the 31 FSS events feed.
 *
 * Only the fields the Calendar screen shows are extracted — this is
 * deliberately not a general-purpose iCal library.
 *
 * ## Times are treated as wall-clock, not UTC
 *
 * The feed stamps every event `TZID=UTC` (e.g. `20260901T170000`), but
 * 31fss.com displays that same event as "September 1 @ 5:00 pm". The site's
 * WordPress timezone is set to UTC, so the numbers in the feed are the local
 * times people are expected to show up at — not instants to be converted.
 *
 * Converting them (Rome is UTC+2 in summer) would show every event two hours
 * late and disagree with the website. So the date-time is read as written and
 * rendered as written.
 */
export type CalendarEvent = {
  uid: string;
  title: string;
  /** Sortable wall-clock key, "YYYY-MM-DDTHH:MM". */
  start: string;
  end?: string;
  allDay: boolean;
  location?: string;
  url?: string;
  categories: string[];
};

/** RFC 5545 folds long lines with CRLF + a space or tab. Join them back up. */
function unfold(text: string): string {
  return text.replace(/\r?\n[ \t]/g, "");
}

/** Unescape RFC 5545 TEXT values. */
function unescapeText(value: string): string {
  return value
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

function readProp(block: string, name: string): { params: string; value: string } | undefined {
  const re = new RegExp(`^${name}([^:\\r\\n]*):(.*)$`, "m");
  const m = block.match(re);
  return m ? { params: m[1], value: m[2].trim() } : undefined;
}

/** "20260901T170000" | "20260901" -> "2026-09-01T17:00" | "2026-09-01" */
function parseStamp(raw: string): { key: string; allDay: boolean } | undefined {
  const m = raw.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2}))?/);
  if (!m) return undefined;
  const [, y, mo, d, hh, mm] = m;
  if (hh === undefined) return { key: `${y}-${mo}-${d}`, allDay: true };
  return { key: `${y}-${mo}-${d}T${hh}:${mm}`, allDay: false };
}

export function parseIcal(raw: string): CalendarEvent[] {
  const text = unfold(raw);
  const blocks = text.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) ?? [];
  const events: CalendarEvent[] = [];

  for (const block of blocks) {
    const startProp = readProp(block, "DTSTART");
    const summary = readProp(block, "SUMMARY");
    if (!startProp || !summary) continue;
    const start = parseStamp(startProp.value);
    if (!start) continue;

    const endProp = readProp(block, "DTEND");
    const end = endProp ? parseStamp(endProp.value) : undefined;
    const categories = readProp(block, "CATEGORIES")?.value ?? "";

    events.push({
      uid: readProp(block, "UID")?.value ?? `${start.key}-${summary.value}`,
      title: unescapeText(summary.value),
      start: start.key,
      end: end?.key,
      allDay: start.allDay || /VALUE=DATE(?!-)/.test(startProp.params),
      location: readProp(block, "LOCATION")?.value
        ? unescapeText(readProp(block, "LOCATION")!.value)
        : undefined,
      url: readProp(block, "URL")?.value || undefined,
      categories: categories
        .split(",")
        .map((c) => unescapeText(c).trim())
        .filter(Boolean),
    });
  }

  return events.sort((a, b) => a.start.localeCompare(b.start));
}

/** "2026-09-01T17:00" -> "5:00 PM" (no timezone maths — see the note above). */
export function formatTime(key: string): string {
  const m = key.match(/T(\d{2}):(\d{2})$/);
  if (!m) return "";
  let h = Number(m[1]);
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m[2]} ${suffix}`;
}

/** "2026-09-01T17:00" -> "Tuesday, September 1" */
export function formatDayHeading(key: string): string {
  const [y, m, d] = key.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/** Today's wall-clock date as "YYYY-MM-DD", for hiding past events. */
export function todayKey(): string {
  const n = new Date();
  const p = (v: number) => String(v).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
}
