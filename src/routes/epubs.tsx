import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, ExternalLink, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/epubs")({
  head: () => ({
    meta: [
      { title: "E-Pubs — Aviano AB" },
      {
        name: "description",
        content:
          "Air Force publications every Airman is expected to know — Airman Handbook, Tongue and Quill, Dress and Appearance, and more.",
      },
    ],
  }),
  component: EpubsPage,
});

/**
 * These link to the official e-Publishing copies rather than files bundled in
 * the app. Publications are revised often, and a stale policy document is
 * worse than no copy at all — linking means readers always get the current
 * edition. Researched and recorded in downloads/E-Pubs/README.txt.
 */
const publications = [
  {
    label: "Airman Handbook",
    pub: "AFH 1",
    href: "https://static.e-publishing.af.mil/production/1/af_a1/publication/afh1/afh1.pdf",
  },
  {
    label: "The Tongue and Quill",
    pub: "AFH 33-337",
    href: "https://static.e-publishing.af.mil/production/1/administrative_assistant/publication/afh33-337/afh33-337.pdf",
  },
  {
    label: "Dress and Personal Appearance",
    pub: "DAFI 36-2903",
    href: "https://static.e-publishing.af.mil/production/1/af_a1/publication/dafi36-2903/dafi36-2903.pdf",
  },
  {
    label: "The Little Brown Book",
    pub: "Enlisted Force Structure · AFH 36-2618",
    href: "https://static.e-publishing.af.mil/production/1/af_a1/publication/afh36-2618/afh36-2618.pdf",
  },
  {
    label: "Guide to Protocol",
    pub: "AFPAM 34-1202",
    href: "https://static.e-publishing.af.mil/production/1/saf_ds/publication/afpam34-1202/afpam34-1202.pdf",
  },
  {
    label: "The Little Blue Book",
    pub: "America's Air Force: A Profession of Arms",
    href: "https://www.airman.af.mil/Little-Blue-Book/",
  },
];

function EpubsPage() {
  return (
    <div>
      <header className="bg-primary text-primary-foreground px-5 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="size-7" />
          <div>
            <h1 className="text-2xl font-bold">E-Pubs</h1>
            <p className="text-sm opacity-90 mt-1">Air Force publications</p>
          </div>
        </div>
      </header>

      <section className="px-5 py-6 max-w-xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              Publications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {publications.map((p) => (
              <Button
                key={p.href}
                variant="outline"
                className="w-full justify-start gap-3 text-left h-auto py-3"
                asChild
              >
                <a href={p.href} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="size-4 shrink-0 text-primary mt-0.5" />
                  <span className="flex-1 min-w-0">
                    <span className="block font-medium break-words whitespace-normal">
                      {p.label}
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5 whitespace-normal">
                      {p.pub}
                    </span>
                  </span>
                  <ExternalLink className="size-4 shrink-0 text-primary mt-0.5" />
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>

        <p className="flex items-start gap-2 text-xs text-muted-foreground px-1">
          <Info className="size-4 shrink-0 mt-0.5" />
          <span>
            These open the official e-Publishing copies, so you always get the current
            edition — they need an internet connection. Search
            www.e-publishing.af.mil by publication number if a link ever moves.
          </span>
        </p>
      </section>
    </div>
  );
}
