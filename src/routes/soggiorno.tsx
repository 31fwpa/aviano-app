import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Clock, MapPin, Phone, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { resolveDocument, isInAppDocument } from "@/lib/documents";

export const Route = createFileRoute("/soggiorno")({
  head: () => ({
    meta: [
      { title: "Soggiorno Office — Aviano AB" },
      {
        name: "description",
        content:
          "Soggiorno permit and codice fiscale applications, hours, and contact details for Aviano Air Base.",
      },
    ],
  }),
  component: SoggiornoPage,
});

// Contact details mirror the Soggiorno Office entry in src/content/directory.json.
const CONTACT = {
  phoneDisplay: "+39 0434 30 4802",
  phoneDial: "00390434304802",
  location: "Area F, Bldg. 1413",
  hours: ["Mon–Wed & Fri: 0730 – 1530", "Closed daily: 1200 – 1300"],
  website: "https://www.31fss.com/codice-fiscale-soggiorno",
};

const applications = [
  { label: "Application for Soggiorno Permit", doc: "APPLICATION FOR SOGGIORNO PERMIT.pdf" },
  { label: "Application for a Newborn", doc: "APPLICATION FOR (NEWBORN).pdf" },
];

function DocButton({ label, doc }: { label: string; doc: string }) {
  const href = resolveDocument(doc);
  const cls = "w-full justify-start gap-3 text-left h-auto py-3";
  if (href && isInAppDocument(href)) {
    return (
      <Button variant="outline" className={cls} asChild>
        <Link to="/document" search={{ doc: href.split("doc=")[1], title: label }}>
          <FileText className="size-4 shrink-0 text-primary" />
          <span className="break-words">{label}</span>
        </Link>
      </Button>
    );
  }
  return (
    <Button variant="outline" disabled className={`${cls} opacity-70`}>
      <FileText className="size-4 shrink-0" />
      <span className="break-words">{label}</span>
    </Button>
  );
}

function SoggiornoPage() {
  return (
    <div>
      <header className="bg-primary text-primary-foreground px-5 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <FileText className="size-7" />
          <div>
            <h1 className="text-2xl font-bold">Soggiorno Office</h1>
            <p className="text-sm opacity-90 mt-1">
              Permesso di soggiorno and codice fiscale
            </p>
          </div>
        </div>
      </header>

      <section className="px-5 py-6 max-w-xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              Applications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {applications.map((a) => (
              <DocButton key={a.doc} label={a.label} doc={a.doc} />
            ))}
            <p className="text-xs text-muted-foreground pt-1">
              Saved in the app — these open without a signal.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5 text-primary" />
              Hours &amp; Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              {CONTACT.hours.map((h) => (
                <p key={h} className="text-sm text-muted-foreground">
                  {h}
                </p>
              ))}
            </div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              {CONTACT.location}
            </p>
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <a href={`tel:${CONTACT.phoneDial}`}>
                <Phone className="size-4 text-primary" />
                {CONTACT.phoneDisplay}
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <a href={CONTACT.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4 text-primary" />
                Codice fiscale &amp; soggiorno info
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
