import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Phone, MapPin, Navigation, ExternalLink, Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import contactsData from "@/content/emergency-contacts.json";
import contentData from "@/content/emergency-content.json";
import type { EmergencyContact, EmergencyContent, ImportantNumberEntry } from "@/content/types";

export const Route = createFileRoute("/emergency")({
  head: () => ({ meta: [{ title: "Emergency — Aviano AB" }] }),
  component: EmergencyPage,
});

function cleanPhone(phone: string) {
  return phone.replace(/[\s()-]/g, "");
}

function NumberCard({
  label,
  phone,
  extension,
  subtext,
}: {
  label: string;
  phone: string;
  extension?: string;
  subtext?: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const display = extension ? `${phone} ext. ${extension}` : phone;
  const dial = cleanPhone(phone);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(display);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <Card className="p-4 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="font-medium leading-tight">{label}</p>
        {subtext && <p className="text-xs text-muted-foreground mt-0.5">{subtext}</p>}
        <p className="text-primary font-mono mt-1">{display}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button asChild size="icon" variant="ghost" aria-label={`Call ${label}`}>
          <a href={`tel:${dial}`}>
            <Phone className="size-5 text-primary" />
          </a>
        </Button>
        <Button
          size="icon"
          variant="ghost"
          aria-label={`Copy ${label} number`}
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="size-5 text-green-600" />
          ) : (
            <Copy className="size-5 text-muted-foreground" />
          )}
        </Button>
      </div>
    </Card>
  );
}

function EmergencyPage() {
  const contacts = useMemo(
    () =>
      [...(contactsData as EmergencyContact[])].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
      ),
    [],
  );
  const content = contentData as EmergencyContent;
  const erQ = encodeURIComponent(content.er_address || "Pordenone Hospital ER");
  const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${erQ}`;
  const appleLink = `https://maps.apple.com/?daddr=${erQ}`;

  const importantNumbers = content.important_numbers?.section_enabled
    ? content.important_numbers.entries
    : [];
  const afpaas = content.afpaas?.section_enabled ? content.afpaas : null;
  const resources = content.resources?.section_enabled
    ? content.resources.entries
    : [];

  return (
    <div>
      <header className="bg-destructive text-destructive-foreground px-5 pt-8 pb-6">
        <h1 className="text-2xl font-bold">Emergency</h1>
        <p className="text-sm opacity-90 mt-1">Tap a number to call or copy.</p>
      </header>
      <div className="px-5 py-6 max-w-xl mx-auto space-y-8">
        {content.guidance && (
          <Card className="p-4 bg-destructive/5 border-destructive/30">
            <p className="text-sm whitespace-pre-wrap">{content.guidance}</p>
          </Card>
        )}

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Emergency Numbers
          </h2>
          <div className="space-y-2">
            {contacts.map((c) => (
              <NumberCard
                key={c.id}
                label={c.label}
                phone={c.phone}
                subtext={c.notes}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Pordenone Hospital ER
          </h2>
          <Card className="p-4">
            <p className="font-medium">{content.er_name || "Pordenone Hospital ER"}</p>
            <p className="text-sm text-muted-foreground flex items-start gap-2 mt-1">
              <MapPin className="size-4 mt-0.5 shrink-0" />
              {content.er_address}
            </p>
            <div className="flex gap-2 mt-3">
              <Button asChild size="sm" variant="default">
                <a href={mapsLink} target="_blank" rel="noreferrer">
                  <Navigation className="size-4" /> Google Maps
                </a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a href={appleLink} target="_blank" rel="noreferrer">
                  <Navigation className="size-4" /> Apple Maps
                </a>
              </Button>
            </div>
            {content.er_lat && content.er_lng && (
              <iframe
                title="ER location"
                className="w-full h-48 mt-3 rounded-md border"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(content.er_lng) - 0.01}%2C${Number(content.er_lat) - 0.01}%2C${Number(content.er_lng) + 0.01}%2C${Number(content.er_lat) + 0.01}&layer=mapnik&marker=${content.er_lat}%2C${content.er_lng}`}
              />
            )}
          </Card>
        </div>

        {importantNumbers.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Important Numbers
            </h2>
            <div className="space-y-2">
              {importantNumbers.map((entry: ImportantNumberEntry, idx: number) => (
                <NumberCard
                  key={idx}
                  label={entry.name}
                  phone={entry.phone}
                  extension={entry.extension}
                />
              ))}
            </div>
          </div>
        )}

        {afpaas && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              {afpaas.name}
            </h2>
            <a href={afpaas.url} target="_blank" rel="noreferrer">
              <Card className="p-4 flex items-center justify-between hover:bg-accent transition">
                <div className="flex items-center gap-2">
                  <ExternalLink className="size-5 text-primary" />
                  <p className="font-medium">Air Force Personnel Accountability & Assessment System</p>
                </div>
              </Card>
            </a>
          </div>
        )}

        {resources.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Resources
            </h2>
            <div className="space-y-2">
              {resources.map((entry, idx) => (
                <a
                  key={idx}
                  href={entry.url.startsWith("http") ? entry.url : `https://${entry.url}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Card className="p-4 flex items-center justify-between hover:bg-accent transition">
                    <div className="flex items-center gap-2 pr-2">
                      <ExternalLink className="size-5 text-primary shrink-0" />
                      <p className="font-medium">{entry.name}</p>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
