import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MapPin, ExternalLink, Loader2, WifiOff, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { loadEvents, FSS_SITE_URL, type EventsResult } from "@/lib/events";
import { formatDayHeading, formatTime, todayKey, type CalendarEvent } from "@/lib/ical";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — Aviano AB" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const [result, setResult] = useState<EventsResult | undefined>();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [filter, setFilter] = useState<string>("All");

  const load = () => {
    setStatus("loading");
    loadEvents()
      .then((r) => {
        setResult(r);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(load, []);

  const upcoming = useMemo(() => {
    const today = todayKey();
    return (result?.events ?? []).filter((e) => e.start.slice(0, 10) >= today);
  }, [result]);

  // FSS tags each event with both a type ("Food") and a venue ("La Bella
  // Vista Club"). Those two often cover *exactly* the same events, which would
  // show two chips that filter identically. Collapse any such pair, keeping
  // the venue — it matches the events' location, so it tells you something the
  // other doesn't.
  const categories = useMemo(() => {
    const members = new Map<string, Set<string>>();
    for (const e of upcoming) {
      for (const c of e.categories) {
        if (!members.has(c)) members.set(c, new Set());
        members.get(c)!.add(e.uid);
      }
    }

    const signature = (uids: Set<string>) => [...uids].sort().join("|");
    const bySignature = new Map<string, string[]>();
    for (const [name, uids] of members) {
      const key = signature(uids);
      bySignature.set(key, [...(bySignature.get(key) ?? []), name]);
    }

    const kept: Array<[string, number]> = [];
    for (const names of bySignature.values()) {
      const winner =
        names.length === 1
          ? names[0]
          : // Prefer the category that names where the events actually are.
            (names.find((n) =>
              upcoming.some((e) => e.categories.includes(n) && e.location === n),
            ) ??
            // Otherwise the most specific-looking name, so the choice is stable.
            [...names].sort((a, b) => b.length - a.length)[0]);
      kept.push([winner, members.get(winner)!.size]);
    }

    return kept
      .filter(([, n]) => n >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([c]) => c);
  }, [upcoming]);

  const shown = filter === "All" ? upcoming : upcoming.filter((e) => e.categories.includes(filter));

  const days = useMemo(() => {
    const byDay = new Map<string, CalendarEvent[]>();
    for (const e of shown) {
      const day = e.start.slice(0, 10);
      byDay.set(day, [...(byDay.get(day) ?? []), e]);
    }
    return [...byDay.entries()];
  }, [shown]);

  return (
    <div className="px-5 py-6 max-w-xl mx-auto">
      <div className="flex items-start justify-between gap-3 mb-1">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button size="icon" variant="ghost" onClick={load} aria-label="Refresh events">
          <RefreshCw className={`size-4 ${status === "loading" ? "animate-spin" : ""}`} />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Events published by 31 FSS. Updates automatically.
      </p>

      {result?.stale && (
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mb-4">
          <WifiOff className="size-4 shrink-0" />
          <span>Showing the last events we downloaded — connect to update.</span>
        </div>
      )}

      {categories.length > 1 && status === "ready" && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 -mx-1 px-1">
          {["All", ...categories].map((c) => (
            <Button
              key={c}
              size="sm"
              variant={filter === c ? "default" : "outline"}
              className="shrink-0"
              onClick={() => setFilter(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      )}

      {status === "loading" && (
        <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <p className="text-sm">Loading events…</p>
        </div>
      )}

      {status === "error" && (
        <Card className="p-5 text-center space-y-3">
          <WifiOff className="size-7 mx-auto text-muted-foreground" />
          <p className="font-medium">Events need an internet connection</p>
          <p className="text-sm text-muted-foreground">
            The rest of the app works offline — the calendar is published live by 31 FSS.
          </p>
          <div className="flex gap-2 justify-center pt-1">
            <Button size="sm" onClick={load}>
              <RefreshCw className="size-4" /> Try again
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={FSS_SITE_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" /> Open 31fss.com
              </a>
            </Button>
          </div>
        </Card>
      )}

      {status === "ready" && days.length === 0 && (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No upcoming events{filter !== "All" ? ` in ${filter}` : ""}.
        </p>
      )}

      <div className="space-y-5">
        {days.map(([day, events]) => (
          <section key={day}>
            <h2 className="text-sm font-semibold text-muted-foreground mb-2">
              {formatDayHeading(day)}
            </h2>
            <div className="space-y-2">
              {events.map((e) => (
                <EventCard key={e.uid} event={e} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {status === "ready" && (
        <a
          href={FSS_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-primary"
        >
          <ExternalLink className="size-4" /> See everything on 31fss.com
        </a>
      )}
    </div>
  );
}

function EventCard({ event }: { event: CalendarEvent }) {
  // FSS tags events with both a venue and a type. The venue is already shown
  // on the location line above, so a badge repeating it is noise — drop it and
  // keep the type, which is the half the card doesn't otherwise say.
  //
  // Compared loosely on purpose: FSS writes the same venue differently in the
  // two fields (category "Arts & Crafts Center" vs location "Arts and Crafts
  // Center"), which an exact match would miss.
  const sameName = (a: string, b: string) => {
    const norm = (s: string) =>
      s
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]/g, "");
    return norm(a) === norm(b);
  };
  const badges = event.categories
    .filter((c) => !sameName(c, event.location ?? ""))
    .slice(0, 2);

  const body = (
    <>
      <div className="flex items-start gap-3">
        <div className="shrink-0 text-center min-w-14">
          {event.allDay ? (
            <span className="text-xs font-semibold text-primary">All day</span>
          ) : (
            <span className="text-xs font-semibold text-primary">{formatTime(event.start)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium leading-tight">{event.title}</p>
          {event.location && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">{event.location}</span>
            </p>
          )}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {badges.map((c) => (
                <Badge key={c} variant="secondary" className="text-[10px]">
                  {c}
                </Badge>
              ))}
            </div>
          )}
        </div>
        {event.url && <ExternalLink className="size-4 shrink-0 text-primary mt-0.5" />}
      </div>
    </>
  );

  if (event.url) {
    return (
      <Card className="p-3 hover:bg-accent transition">
        <a href={event.url} target="_blank" rel="noopener noreferrer" className="block">
          {body}
        </a>
      </Card>
    );
  }
  return <Card className="p-3">{body}</Card>;
}
