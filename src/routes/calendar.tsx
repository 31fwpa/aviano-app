import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import eventsData from "@/content/events.json";
import type { EventItem } from "@/content/types";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — Aviano AB" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const events = useMemo(() => {
    const cutoff = new Date(Date.now() - 86400000).toISOString();
    return (eventsData as EventItem[])
      .filter((e) => e.starts_at >= cutoff)
      .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  }, []);
  const [filter, setFilter] = useState<"all" | "operational" | "recreational">("all");
  const list = events.filter((e) => filter === "all" || e.type === filter);
  return (
    <div className="px-5 py-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <div className="flex gap-2 mb-4">
        {(["all", "operational", "recreational"] as const).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f[0].toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {filter !== "operational" && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">31 FSS Community Calendar</h2>
          <div className="rounded-lg border border-border overflow-hidden bg-card aspect-[4/3]">
            <iframe
              src="https://calendar.google.com/calendar/embed?src=nnsfp39p8nnc4s79krav8pecubo0o5qp%40import.calendar.google.com&mode=AGENDA&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0"
              className="w-full h-full"
              style={{ border: 0 }}
              loading="lazy"
              title="31 FSS Community Calendar"
            />
          </div>
        </div>
      )}

      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">No upcoming events.</p>
      ) : (
        <div className="space-y-2">
          {list.map((e) => (
            <Card key={e.id} className="p-4">
              <div className="flex justify-between items-start gap-2">
                <p className="font-medium">{e.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded ${e.type === "operational" ? "bg-primary/15 text-primary" : "bg-accent text-accent-foreground"}`}>
                  {e.type}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(e.starts_at).toLocaleString()}
                {e.ends_at && ` – ${new Date(e.ends_at).toLocaleString()}`}
              </p>
              {e.location && <p className="text-sm mt-1">📍 {e.location}</p>}
              {e.description && <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{e.description}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}