import { Capacitor, CapacitorHttp } from "@capacitor/core";
import { parseIcal, type CalendarEvent } from "@/lib/ical";

/**
 * The 31 FSS events feed — the same calendar published on 31fss.com.
 *
 * The app reads this live so FSS remains the single source of truth and
 * nothing has to be re-entered here. It is the one screen that needs
 * internet; everything else in the app is bundled.
 */
export const FSS_FEED_URL =
  "https://31fss.com/?post_type=tribe_events&ical=1&eventDisplay=list";

export const FSS_SITE_URL = "https://31fss.com/events/";

/** Dev-server proxy path (see vite.config.ts) — the feed sends no CORS
 *  headers, so a browser cannot request it directly. */
const DEV_PROXY_URL = "/fss-events.ics";

const CACHE_KEY = "fss-events-v1";

type Cached = { fetchedAt: number; events: CalendarEvent[] };

function readCache(): Cached | undefined {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Cached) : undefined;
  } catch {
    return undefined;
  }
}

function writeCache(events: CalendarEvent[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), events }));
  } catch {
    // Storage can be unavailable or full — caching is a bonus, never required.
  }
}

async function fetchFeed(): Promise<string> {
  if (Capacitor.isNativePlatform()) {
    // Native HTTP, because the feed sends no CORS headers and a webview
    // fetch from https://localhost would be blocked.
    const res = await CapacitorHttp.get({ url: FSS_FEED_URL, responseType: "text" });
    if (res.status >= 400) throw new Error(`feed returned ${res.status}`);
    return typeof res.data === "string" ? res.data : String(res.data);
  }
  const res = await fetch(DEV_PROXY_URL);
  if (!res.ok) throw new Error(`feed returned ${res.status}`);
  return res.text();
}

export type EventsResult = {
  events: CalendarEvent[];
  /** True when the network failed and these came from the last good fetch. */
  stale: boolean;
  fetchedAt?: number;
};

/**
 * Load events, preferring a fresh fetch and falling back to the last good
 * copy. Returning stale events beats an empty screen when someone is offline.
 */
export async function loadEvents(): Promise<EventsResult> {
  try {
    const events = parseIcal(await fetchFeed());
    if (events.length) writeCache(events);
    return { events, stale: false, fetchedAt: Date.now() };
  } catch (err) {
    console.warn("[events] live fetch failed, falling back to cache", err);
    const cached = readCache();
    if (cached) return { events: cached.events, stale: true, fetchedAt: cached.fetchedAt };
    throw err;
  }
}
