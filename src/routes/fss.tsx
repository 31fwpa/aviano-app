import { createFileRoute, Link } from "@tanstack/react-router";
import { Ticket, ExternalLink, Phone, Mail, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/fss")({
  head: () => ({
    meta: [
      { title: "31st Force Support Squadron — Aviano AB" },
      {
        name: "description",
        content:
          "31 FSS facilities, events, dining, fitness, and outdoor recreation at Aviano Air Base.",
      },
    ],
  }),
  component: FssPage,
});

const links = [
  {
    label: "31 FSS home",
    note: "Everything FSS runs — clubs, fitness, childcare, outdoor rec",
    href: "https://www.31fss.com/",
  },
  {
    label: "Newcomers — First 31",
    note: "Start here after you PCS in",
    href: "https://31fss.com/first-31-pcs-start/",
  },
  {
    label: "Information, Tickets & Travel (ITT)",
    note: "Trips, tickets, and tours in Italy and beyond",
    href: "https://www.31fss.com/itt",
  },
  {
    label: "Outdoor Recreation",
    note: "Equipment rental, trips, and adventure programmes",
    href: "https://www.31fss.com/outdoor-recreation",
  },
  {
    label: "Driving overseas",
    note: "AFI licence application process for driving in Italy",
    href: "https://www.31fss.com/driving-overseas",
  },
];

const contacts = [
  {
    label: "Marketing Office (FSS)",
    phoneDisplay: "0434 30 5080",
    phoneDial: "0434305080",
    email: "31fss.marketing@us.af.mil",
  },
];

function FssPage() {
  return (
    <div>
      <header className="bg-primary text-primary-foreground px-5 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <Ticket className="size-7" />
          <div>
            <h1 className="text-2xl font-bold">31 FSS</h1>
            <p className="text-sm opacity-90 mt-1">Force Support Squadron</p>
          </div>
        </div>
      </header>

      <section className="px-5 py-6 max-w-xl mx-auto space-y-4">
        {/* FSS publishes the calendar the app already shows — point at it
            rather than duplicating the listing here. */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-muted-foreground">
              FSS events appear on the app's Calendar, updated automatically from 31fss.com.
            </p>
            <Button size="sm" variant="outline" className="mt-3" asChild>
              <Link to="/calendar">
                <CalendarDays className="size-4" /> Open the calendar
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="size-5 text-primary" />
              FSS links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {links.map((l) => (
              <Button
                key={l.href}
                variant="outline"
                className="w-full justify-start gap-3 text-left h-auto py-3"
                asChild
              >
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-4 shrink-0 text-primary mt-0.5" />
                  <span className="flex-1 min-w-0">
                    <span className="block break-words whitespace-normal">{l.label}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5 whitespace-normal">
                      {l.note}
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
              <Phone className="size-5 text-primary" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {contacts.map((c) => (
              <div key={c.email} className="space-y-2">
                <p className="text-sm font-medium">{c.label}</p>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <a href={`tel:${c.phoneDial}`}>
                    <Phone className="size-4 text-primary" />
                    {c.phoneDisplay}
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <a href={`mailto:${c.email}`}>
                    <Mail className="size-4 shrink-0 text-primary" />
                    <span className="break-all text-left">{c.email}</span>
                  </a>
                </Button>
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-1">
              Facility-specific numbers are in the Directory.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
