import { createFileRoute, Link } from "@tanstack/react-router";
import { Siren, Plane, FileWarning, Eye, ExternalLink, Wifi, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { resolveDocument, isInAppDocument } from "@/lib/documents";

export const Route = createFileRoute("/report-hub")({
  head: () => ({
    meta: [
      { title: "Report Hub — Aviano AB" },
      {
        name: "description",
        content:
          "Report a drone sighting, an incident, or suspicious activity at Aviano Air Base.",
      },
    ],
  }),
  component: ReportHubPage,
});

type ReportItem = {
  label: string;
  description: string;
  href?: string;
  Icon: typeof Plane;
};

const reports: ReportItem[] = [
  {
    label: "Drone Report",
    description:
      "Report an unmanned aircraft sighting over or near the installation. Opens the AFOSI reporting form.",
    href: "https://forms.osi.apps.mil/Pages/ResponsePage.aspx?id=jbExg4ct70ijX6yIGOv5tLbCqbBMo-1DqNuLG6ocCIJUOFNSSVNJSUtWTURaUjJORkhOSjE5QkpWMi4u",
    Icon: Plane,
  },
  {
    label: "Incident Report",
    description: "Report an incident to AFOSI.",
    href: "https://forms.osi.apps.mil/Pages/ResponsePage.aspx?id=jbExg4ct70ijX6yIGOv5tF89drW_3dhGuFzkEuYYNdhUMzg1UzkzQ0ZJNUNBVktLT0NDUkdYSjA0WC4u&origin=QRCode",
    Icon: FileWarning,
  },
  {
    label: "Suspicious Activity Report",
    description: "How and what to report. Saved in the app — works without a signal.",
    href: resolveDocument("ReportSusness.png"),
    Icon: Eye,
  },
];

// Taken from the suspicious-activity guide. JDOC is the Law Enforcement Desk
// in the directory (0434-30-7200); 112 is the Italian emergency number.
const callNumbers = [
  {
    label: "Joint Defense Operations Center (JDOC)",
    note: "Suspicious activity on base · DSN 632-7200",
    dial: "0434307200",
    display: "0434-30-7200",
  },
  {
    label: "Carabinieri",
    note: "Suspicious activity off base",
    dial: "112",
    display: "112",
  },
];

function ReportCard({ item }: { item: ReportItem }) {
  const { Icon, label, description, href } = item;
  const inner = (
    <>
      <Icon className="size-5 shrink-0 text-primary mt-0.5" />
      <span className="flex-1 min-w-0">
        <span className="block font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground mt-0.5 whitespace-normal">
          {description}
        </span>
      </span>
      <ExternalLink className="size-4 shrink-0 text-primary mt-0.5" />
    </>
  );
  const cls = "w-full justify-start gap-3 text-left h-auto py-3 items-start";

  if (href && isInAppDocument(href)) {
    return (
      <Button variant="outline" className={cls} asChild>
        <Link to="/document" search={{ doc: href.split("doc=")[1], title: label }}>
          {inner}
        </Link>
      </Button>
    );
  }
  if (href) {
    return (
      <Button variant="outline" className={cls} asChild>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {inner}
        </a>
      </Button>
    );
  }
  return null;
}

function ReportHubPage() {
  return (
    <div>
      <header className="bg-primary text-primary-foreground px-5 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <Siren className="size-7" />
          <div>
            <h1 className="text-2xl font-bold">Report Hub</h1>
            <p className="text-sm opacity-90 mt-1">
              Drone sightings, incidents, and suspicious activity
            </p>
          </div>
        </div>
      </header>

      <section className="px-5 py-6 max-w-xl mx-auto space-y-4">
        {/* An emergency must never be routed through a web form. */}
        <Card className="border-destructive/30 bg-destructive/10">
          <CardContent className="pt-4 pb-4">
            <p className="text-sm font-medium text-destructive">
              In an emergency, call — don't fill in a form.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Use the Emergency screen for immediate danger. These reports are for
              non-emergency reporting.
            </p>
            <Button size="sm" variant="destructive" className="mt-3" asChild>
              <Link to="/emergency">
                <Siren className="size-4" /> Emergency numbers
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* The suspicious-activity guide states these numbers, but as pixels in
            an image — nobody can tap a picture. Repeat them here as real
            tap-to-call links so reporting doesn't depend on retyping. */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="size-5 text-primary" />
              Who to call
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {callNumbers.map(({ label, note, dial, display }) => (
              <Button key={label} variant="outline" className="w-full justify-start gap-3 text-left h-auto py-3 items-start" asChild>
                <a href={`tel:${dial}`}>
                  <Phone className="size-5 shrink-0 text-primary mt-0.5" />
                  <span className="flex-1 min-w-0">
                    <span className="block font-medium break-words whitespace-normal">{label}</span>
                    <span className="block text-base font-semibold text-primary mt-0.5">
                      {display}
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5 whitespace-normal">
                      {note}
                    </span>
                  </span>
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileWarning className="size-5 text-primary" />
              Make a report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {reports.map((r) => (
              <ReportCard key={r.label} item={r} />
            ))}
          </CardContent>
        </Card>

        <p className="flex items-start gap-2 text-xs text-muted-foreground px-1">
          <Wifi className="size-4 shrink-0 mt-0.5" />
          <span>
            The AFOSI forms are hosted on a .mil site and need an internet connection;
            they may also ask you to sign in. The suspicious activity guide is saved in
            the app and works offline.
          </span>
        </p>
      </section>
    </div>
  );
}
