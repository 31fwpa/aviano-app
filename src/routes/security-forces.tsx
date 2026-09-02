import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield,
  Clock,
  Car,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { resolveDocument, isInAppDocument } from "@/lib/documents";

export const Route = createFileRoute("/security-forces")({
  head: () => ({
    meta: [
      { title: "31st Security Forces Squadron — Aviano AB" },
      {
        name: "description",
        content:
          "Pass and Registration, gate hours, and quick links for 31st SFS at Aviano Air Base.",
      },
    ],
  }),
  component: SecurityForcesPage,
});

const passAndRegHours = [
  {
    days: "Monday – Friday",
    hours: "0730 - 1530",
    note: "Queue stops serving customers after 1510",
  },
  {
    days: "3rd Thursday of the Month",
    hours: "0730 - 1200",
    note: "Queue stops serving customers after 1140",
  },
];

const quickLinks = [
  {
    label: "AFI License Application",
    icon: FileText,
    href: resolveDocument("AFI License Application.pdf"),
  },
  {
    label: "AFI Application Process (Driving License)",
    icon: FileText,
    href: "https://www.31fss.com/driving-overseas",
  },
  { label: "IAR Checklist", icon: Shield, href: resolveDocument("IAR Checklist.pdf") },
  { label: "IAR (Installation Access Request)", icon: Shield, href: resolveDocument("IAR.pdf") },
  {
    label: "Kiosk Sign-In",
    icon: Shield,
    href: "https://qkonline.queuekiosk.com/?QID=97&QTKN=avi389ksd8x83hf3s",
  },
  {
    label: "Vehicle Registration",
    icon: Car,
    href: "https://www.31fss.com/vehicle-registration",
  },
  // The reporting forms live on the Report Hub, which also carries the
  // emergency guidance that belongs alongside them.
  { label: "Incident Report Form", icon: FileText, to: "/report-hub" },
];

function HoursSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="size-5 text-primary" />
          Pass & Reg Hours
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {passAndRegHours.map((entry) => (
          <div
            key={entry.days}
            className="border-b border-border last:border-0 pb-3 last:pb-0"
          >
            <p className="font-medium">{entry.days}</p>
            <p className="text-muted-foreground">{entry.hours}</p>
            <p className="text-sm text-muted-foreground">{entry.note}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function QuickLinksSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="size-5 text-primary" />
          Quick Links & Forms
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {quickLinks.map(({ label, icon: Icon, href, to }) => (
            <li key={label}>
              {to ? (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-left h-auto py-3"
                  asChild
                >
                  <Link to={to}>
                    <Icon className="size-4 text-primary shrink-0" />
                    <span className="break-words">{label}</span>
                  </Link>
                </Button>
              ) : href && isInAppDocument(href) ? (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-left h-auto py-3"
                  asChild
                >
                  {/* Bundled document — opens in the in-app viewer, works offline */}
                  <Link to="/document" search={{ doc: href.split("doc=")[1], title: label }}>
                    <Icon className="size-4 text-primary shrink-0" />
                    <span className="break-words">{label}</span>
                  </Link>
                </Button>
              ) : href ? (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-left h-auto py-3"
                  asChild
                >
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="size-4 text-primary shrink-0" />
                    <span className="break-words">{label}</span>
                  </a>
                </Button>
              ) : (
                // No link published for this one yet. Show it honestly rather
                // than a button that appears to work and doesn't.
                <Button
                  variant="outline"
                  disabled
                  className="w-full justify-start gap-2 text-left h-auto py-3 opacity-70"
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="flex-1 min-w-0 break-words whitespace-normal">{label}</span>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold shrink-0">
                    Coming soon
                  </span>
                </Button>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SecurityForcesPage() {
  return (
    <div>
      <header className="bg-primary text-primary-foreground px-5 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <Shield className="size-7" />
          <div>
            <h1 className="text-2xl font-bold">31 SFS</h1>
            <p className="text-sm opacity-90 mt-1">
              31st Security Forces Squadron — Aviano AB
            </p>
          </div>
        </div>
      </header>

      <section className="px-5 py-6 max-w-xl mx-auto space-y-6">
        <Tabs defaultValue="hours">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="hours">Hours</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>

          <TabsContent value="hours" className="mt-4 space-y-4">
            <HoursSection />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="size-5 text-primary" />
                  Alternate Gate Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Down Day Gate Hours — check back for updates.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="mt-4">
            <QuickLinksSection />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

