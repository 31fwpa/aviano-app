import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Megaphone, Home, Shield, Stethoscope, Heart, Truck, AlertTriangle, Users, FileText, Ticket, HardHat, Radio, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import wingShield from "@/assets/wing-shield.png";
import announcementsData from "@/content/announcements.json";
import type { Announcement } from "@/content/types";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const announcements: Announcement[] = (announcementsData as Announcement[])
    .filter((a) => a.published)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 3);

  return (
    <div>
      <header className="bg-gradient-to-br from-[oklch(0.25_0.08_255)] to-[oklch(0.4_0.1_255)] text-white px-5 pt-10 pb-8">
        <div className="flex items-center gap-3">
          <img
            src={wingShield}
            alt="31st Fighter Wing shield"
            className="size-16 shrink-0 drop-shadow-md"
          />
          <div>
            <p className="text-xs uppercase tracking-widest opacity-80">31st Fighter Wing</p>
            <h1 className="text-2xl font-bold mt-1 leading-tight">Aviano Air Base</h1>
          </div>
        </div>
        <p className="opacity-90 mt-2 text-sm">
          Your hub for base services, events, and emergency information.
        </p>
      </header>

      <section className="px-5 py-6 max-w-xl mx-auto space-y-4">

        {/* Emergency, Calendar and Directory all live in the bottom nav, so
            they aren't repeated here. This banner points at Report Hub, which
            has no other prominent entry point. */}
        <Link
          to="/report-hub"
          className="flex items-center gap-3 p-4 rounded-lg bg-destructive text-destructive-foreground hover:opacity-95 transition"
        >
          <AlertTriangle className="size-5 shrink-0" />
          <span className="min-w-0">
            <span className="block font-semibold">Report Hub</span>
            <span className="block text-xs opacity-90">
              Drone sightings, incidents, suspicious activity
            </span>
          </span>
        </Link>

        <div>
          <h2 className="font-semibold text-lg mb-2">Latest announcements</h2>
          {announcements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No announcements yet.</p>
          ) : (
            <div className="space-y-2">
              {announcements.map((a) => (
                <Card key={a.id} className="p-4">
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{a.body}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(a.created_at).toLocaleString()}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <QuickLink to="/pa" icon={<Megaphone className="size-5" />} label="Public Affairs" />
          <QuickLink to="/housing" icon={<Home className="size-5" />} label="Housing" />
          <QuickLink
            to="/security-forces"
            icon={<Shield className="size-5" />}
            label="Security Forces"
          />
          <QuickLink
            to="/medical-group"
            icon={<Stethoscope className="size-5" />}
            label="Medical Group"
          />
          <QuickLink
            href="https://cobraclinic.notion.site/COBRA-Clinic-11ac0d2706634b7c92235684db45d7a2"
            icon={<Heart className="size-5" />}
            label="Cobra Clinic"
          />
          <QuickLink to="/lrs" icon={<Truck className="size-5" />} label="LRS" />
          <QuickLink to="/mfrc" icon={<Users className="size-5" />} label="M & FRC" />
          <QuickLink
            to="/soggiorno"
            icon={<FileText className="size-5" />}
            label="Soggiorno"
          />
          <QuickLink to="/fss" icon={<Ticket className="size-5" />} label="31 FSS" />
          <QuickLink to="/safety" icon={<HardHat className="size-5" />} label="Safety" />
          <QuickLink to="/afn" icon={<Radio className="size-5" />} label="AFN" />
          <QuickLink to="/epubs" icon={<BookOpen className="size-5" />} label="E-Pubs" />
        </div>
        <Button asChild variant="outline" className="w-full">
          <a href="https://31fss.com/first-31-pcs-start/" target="_blank" rel="noopener noreferrer"><ExternalLink className="size-4" /> Newcomers</a>
        </Button>
      </section>
    </div>
  );
}

function QuickLink({
  to,
  href,
  icon,
  label,
  className,
}: {
  to?: string;
  href?: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}) {
  const classes = cn(
    "flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent transition",
    className,
  );
  const content = (
    <>
      <div className="text-primary">{icon}</div>
      <span className="font-medium">{label}</span>
    </>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }
  return (
    <Link to={to!} className={classes}>
      {content}
    </Link>
  );
}

