import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — Aviano AB" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const [view, setView] = useState<"MONTH" | "AGENDA">("MONTH");
  return (
    <div className="px-5 py-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <h2 className="text-lg font-semibold mb-2">31 FSS Community Calendar</h2>
      <div className="flex gap-2 mb-2">
        {(["MONTH", "AGENDA"] as const).map((m) => (
          <Button
            key={m}
            size="sm"
            variant={view === m ? "default" : "outline"}
            onClick={() => setView(m)}
          >
            {m === "MONTH" ? "Month" : "Agenda"}
          </Button>
        ))}
      </div>
      <div className={`rounded-lg border border-border overflow-hidden bg-card ${view === "MONTH" ? "h-[600px]" : "aspect-[4/3]"}`}>
        <iframe
          src={`https://calendar.google.com/calendar/embed?src=nnsfp39p8nnc4s79krav8pecubo0o5qp%40import.calendar.google.com&mode=${view}&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0`}
          className="w-full h-full"
          style={{ border: 0 }}
          loading="lazy"
          title="31 FSS Community Calendar"
        />
      </div>
    </div>
  );
}