import { createFileRoute } from "@tanstack/react-router";
import { HardHat, Clock, Phone, ExternalLink, Car, BookOpen, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Wing Safety — Aviano AB" },
      {
        name: "description",
        content:
          "31st Fighter Wing Safety office hours, contacts, vehicle accident guidance, and safety publications.",
      },
    ],
  }),
  component: SafetyPage,
});

// Contact details mirror the Safety entry in src/content/directory.json.
const OFFICE = {
  phoneDisplay: "+39 0434 30 7233",
  phoneDial: "00390434307233",
  standbyDisplay: "+39 0434 668 236",
  standbyDial: "+390434668236",
  hours: "Mon–Fri 0730–1630",
  closed: "Closed weekends, holidays, Family Days and Goal Days.",
};

const publications = [
  {
    label: "Air Force Safety Center",
    note: "Mishap prevention, seasonal campaigns, and safety guidance",
    href: "https://www.safety.af.mil/",
  },
  {
    label: "Safety publications (e-Publishing)",
    note: "Official AFI 91-series safety instructions",
    href: "https://www.e-publishing.af.mil/",
  },
];

function SafetyPage() {
  return (
    <div>
      <header className="bg-primary text-primary-foreground px-5 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <HardHat className="size-7" />
          <div>
            <h1 className="text-2xl font-bold">Wing Safety</h1>
            <p className="text-sm opacity-90 mt-1">31st Fighter Wing Safety Office</p>
          </div>
        </div>
      </header>

      <section className="px-5 py-6 max-w-xl mx-auto space-y-4">
        {/* After a crash people reach for the app, not a website — put the
            actionable steps on the page rather than behind a link. */}
        <Card className="border-destructive/30 bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Car className="size-5" />
              In a vehicle accident
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">On base:</span> call the Law
              Enforcement Desk and stay with the vehicle.
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Off base:</span> call{" "}
              <span className="font-medium text-foreground">112</span> for police or medical
              help. Italian law requires you to exchange details and complete a{" "}
              <em>Constatazione Amichevole</em> (blue accident form) where possible.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button size="sm" variant="destructive" asChild>
                <a href="tel:0434307200">
                  <Phone className="size-4" /> Law Enforcement Desk
                </a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href="tel:112">
                  <Phone className="size-4" /> 112
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Report the mishap to Wing Safety afterwards — on- and off-duty mishaps are both
              reportable.
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
              <p className="text-sm text-muted-foreground">{OFFICE.hours}</p>
              <p className="text-sm text-muted-foreground">{OFFICE.closed}</p>
            </div>
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <a href={`tel:${OFFICE.phoneDial}`}>
                <Phone className="size-4 text-primary" />
                {OFFICE.phoneDisplay}
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 text-left h-auto py-3" asChild>
              <a href={`tel:${OFFICE.standbyDial}`}>
                <AlertTriangle className="size-4 shrink-0 text-amber-500" />
                <span className="flex-1 min-w-0">
                  <span className="block">Standby phone (after hours)</span>
                  <span className="block text-sm font-semibold text-primary mt-0.5">
                    {OFFICE.standbyDisplay}
                  </span>
                </span>
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              Safety resources
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
                  <ExternalLink className="size-4 shrink-0 text-primary mt-0.5" />
                  <span className="flex-1 min-w-0">
                    <span className="block break-words whitespace-normal">{p.label}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5 whitespace-normal">
                      {p.note}
                    </span>
                  </span>
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
