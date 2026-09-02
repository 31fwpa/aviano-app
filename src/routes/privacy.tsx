import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — Aviano Air Base" },
      {
        name: "description",
        content: "What the Aviano Air Base app collects, stores, and shares.",
      },
    ],
  }),
  component: PrivacyPage,
});

/**
 * Both app stores require a privacy policy, and it must describe what the app
 * actually does. Everything below is written against the real behaviour of
 * this codebase — if the app starts collecting something new, this page and
 * the store privacy declarations have to change with it.
 */
function PrivacyPage() {
  return (
    <div>
      <header className="bg-primary text-primary-foreground px-5 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-7" />
          <div>
            <h1 className="text-2xl font-bold">Privacy</h1>
            <p className="text-sm opacity-90 mt-1">What this app does with your data</p>
          </div>
        </div>
      </header>

      <section className="px-5 py-6 max-w-xl mx-auto space-y-4">
        <Card>
          <CardContent className="pt-4 pb-4 space-y-3 text-sm">
            <p className="font-medium">
              This app does not ask for your name, e-mail, or any account.
            </p>
            <p className="text-muted-foreground">
              There is no sign-in, no analytics, no advertising, and no tracking across
              other apps or websites. Directory listings, emergency information, and
              documents are stored inside the app and are read without contacting anyone.
            </p>
          </CardContent>
        </Card>

        <Section title="What is collected">
          <Item label="Notification token">
            If you allow notifications, your device is issued an anonymous token by Apple
            or Google so alerts can reach this phone. The token is stored by the 31st
            Fighter Wing Public Affairs office and is not linked to your name or account.
            Declining notifications stops this entirely.
          </Item>
          <Item label="Nothing else">
            No location, contacts, photos, microphone, camera, or advertising identifier is
            requested or read.
          </Item>
        </Section>

        <Section title="What stays on your phone">
          <Item label="Calendar cache">
            The most recent copy of the 31 FSS events list is saved on the device so the
            Calendar still shows something without a signal. It never leaves the phone and
            is removed when the app is uninstalled.
          </Item>
        </Section>

        <Section title="When the app connects to the internet">
          <Item label="Calendar">Loads events published by 31 FSS at 31fss.com.</Item>
          <Item label="Notifications">
            Registers for and receives alerts through Apple's and Google's services.
          </Item>
          <Item label="Outside links">
            Some buttons open other websites — TRICARE, e-Publishing, AFOSI reporting
            forms, 31fss.com and similar. Those sites are run by other organisations and
            have their own privacy policies. This app sends them nothing about you.
          </Item>
          <p className="text-muted-foreground">
            Everything else — the directory, emergency information, and all bundled
            documents — works with no connection at all.
          </p>
        </Section>

        <Section title="Children">
          <Item label="">
            The app is general base information and is not directed at children. It
            collects nothing that could identify anyone, of any age.
          </Item>
        </Section>

        <Section title="Questions">
          <Item label="">
            Contact 31st Fighter Wing Public Affairs. Their details are in the app's
            Public Affairs section.
          </Item>
        </Section>

        <p className="text-xs text-muted-foreground px-1">Last updated: September 2026.</p>
      </section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-semibold mb-2">{title}</h2>
      <Card>
        <CardContent className="pt-4 pb-4 space-y-3 text-sm">{children}</CardContent>
      </Card>
    </div>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground">
      {label && <span className="font-medium text-foreground">{label}: </span>}
      {children}
    </p>
  );
}
