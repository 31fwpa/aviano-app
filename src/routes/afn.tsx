import { createFileRoute } from "@tanstack/react-router";
import { Radio, Phone, Mail, ExternalLink, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/afn")({
  head: () => ({
    meta: [
      { title: "AFN Aviano — Aviano AB" },
      {
        name: "description",
        content:
          "American Forces Network Aviano — radio, the AFN app, and contact details.",
      },
    ],
  }),
  component: AfnPage,
});

// Contact details mirror the "AFN - Radio" entry in src/content/directory.json.
const AFN = {
  phoneDisplay: "0434 30 4878",
  phoneDial: "0434304878",
  email: "dma.aviano.afn.mbx.afn-aviano@mail.mil",
  europe: "https://www.afneurope.net",
  app: "https://www.afnpacific.net/AFN-App/",
};

function AfnPage() {
  return (
    <div>
      <header className="bg-primary text-primary-foreground px-5 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <Radio className="size-7" />
          <div>
            <h1 className="text-2xl font-bold">AFN Aviano</h1>
            <p className="text-sm opacity-90 mt-1">American Forces Network</p>
          </div>
        </div>
      </header>

      <section className="px-5 py-6 max-w-xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="size-5 text-primary" />
              Listen &amp; watch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-3 text-left h-auto py-3" asChild>
              <a href={AFN.europe} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4 shrink-0 text-primary mt-0.5" />
                <span className="flex-1 min-w-0">
                  <span className="block">AFN Europe</span>
                  <span className="block text-xs text-muted-foreground mt-0.5 whitespace-normal">
                    Schedules, streams, and station news
                  </span>
                </span>
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 text-left h-auto py-3" asChild>
              <a href={AFN.app} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4 shrink-0 text-primary mt-0.5" />
                <span className="flex-1 min-w-0">
                  <span className="block">The AFN app</span>
                  <span className="block text-xs text-muted-foreground mt-0.5 whitespace-normal">
                    Live radio and on-demand listening on your phone
                  </span>
                </span>
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="size-5 text-primary" />
              Contact the station
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <a href={`tel:${AFN.phoneDial}`}>
                <Phone className="size-4 text-primary" />
                {AFN.phoneDisplay}
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <a href={`mailto:${AFN.email}`}>
                <Mail className="size-4 shrink-0 text-primary" />
                <span className="break-all text-left">{AFN.email}</span>
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
