import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Phone, Mail, Clock, MapPin, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import directoryData from "@/content/directory.json";
import type { DirectoryEntry } from "@/content/types";

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const DAY_SHORT: Record<string, string> = { Mon: "M", Tue: "T", Wed: "W", Thu: "Th", Fri: "F", Sat: "Sa", Sun: "Su" };

function parseHours(raw: string): Array<{ day: string; times: string }> | null {
  const parts = raw.split(/[,;]\s*/);
  const byDay = new Map<string, string[]>();
  const dayRe = /^\s*(Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:\s*[–-]\s*(Mon|Tue|Wed|Thu|Fri|Sat|Sun))?\s+(.+?)\s*$/i;
  for (const part of parts) {
    const m = part.match(dayRe);
    if (!m) return null;
    const start = DAY_ORDER.indexOf(((m[1][0].toUpperCase() + m[1].slice(1).toLowerCase()) as typeof DAY_ORDER[number]));
    const endRaw = m[2] ? (m[2][0].toUpperCase() + m[2].slice(1).toLowerCase()) : m[1][0].toUpperCase() + m[1].slice(1).toLowerCase();
    const end = DAY_ORDER.indexOf(endRaw as typeof DAY_ORDER[number]);
    if (start < 0 || end < 0) return null;
    const times = m[3].replace(/–/g, "-").trim();
    for (let i = start; i <= end; i++) {
      const d = DAY_ORDER[i];
      if (!byDay.has(d)) byDay.set(d, []);
      byDay.get(d)!.push(times);
    }
  }
  return DAY_ORDER.filter((d) => byDay.has(d)).map((d) => ({ day: DAY_SHORT[d], times: byDay.get(d)!.join(" ") }));
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BC\u201B]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, "-");
}

export const Route = createFileRoute("/directory")({
  head: () => ({ meta: [{ title: "Directory — Aviano AB" }] }),
  component: DirectoryPage,
});

function DirectoryPage() {
  const entries = useMemo(() => {
    const list = directoryData as DirectoryEntry[];
    return [...list].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );
  }, []);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const categories = useMemo(
    () => Array.from(new Set(entries.map((e) => e.category))).sort(),
    [entries],
  );
  const filtered = useMemo(() => {
    const s = normalize(q).trim();
    return entries.filter((e) => {
      if (category !== "all" && e.category !== category) return false;
      if (!s) return true;
      return [e.name, e.category, e.phone, e.email, e.location, e.notes, e.url].some(
        (v) => (v ? normalize(v).includes(s) : false),
      );
    });
  }, [entries, q, category]);

  return (
    <div className="px-5 py-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Directory</h1>
      <div className="mb-4 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search services, names, locations…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(q || category !== "all") && (
          <p className="text-xs text-muted-foreground">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </p>
        )}
      </div>
      {filtered.length === 0 && <p className="text-sm text-muted-foreground">No matches.</p>}
      <div className="space-y-2">
        {filtered.map((e) => (
          <Card key={e.id} className="p-4">
                  <p className="font-medium">{e.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{e.category}</p>
                  {e.notes && <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap break-words">{e.notes}</p>}
                  <div className="mt-2 space-y-1 text-sm">
                    {e.url && (
                      <a href={e.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary">
                        <ExternalLink className="size-4" /> More info
                      </a>
                    )}
                    {e.phone && (
                      <a href={`tel:${e.phone}`} className="flex items-center gap-2 text-primary">
                        <Phone className="size-4" /> {e.phone}
                      </a>
                    )}
                    {e.email && (
                      <a href={`mailto:${e.email}`} className="flex items-center gap-2 text-primary">
                        <Mail className="size-4" /> {e.email}
                      </a>
                    )}
                    {e.hours && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <Clock className="size-4 mt-0.5 shrink-0" />
                        {(() => {
                          const parsed = parseHours(e.hours!);
                          if (!parsed || parsed.length === 0) return <span>{e.hours}</span>;
                          return (
                            <div className="text-sm leading-relaxed">
                              {parsed.map((row) => (
                                <div key={row.day}>
                                  <span className="inline-block w-6">{row.day}:</span> {row.times}
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    {(() => {
                      const loc = e.location?.trim();
                      if (!loc || loc === "-" || loc.toLowerCase() === "n/a") return null;
                      return (
                        <p className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="size-4" /> {loc}
                        </p>
                      );
                    })()}
                  </div>
          </Card>
        ))}
      </div>
    </div>
  );
}