import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/pa")({
  head: () => ({
    meta: [
      { title: "Public Affairs — Aviano AB" },
      { name: "description", content: "Connect with Aviano Air Base Public Affairs." },
    ],
  }),
  component: PaPage,
});

const links = [
  {
    name: "Aviano Air Base official site",
    url: "https://www.aviano.af.mil/",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/avianoairbase/",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/avianoairbase/",
  },
];

function PaPage() {
  return (
    <div>
      <header className="bg-primary text-primary-foreground px-5 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <Megaphone className="size-7" />
          <div>
            <h1 className="text-2xl font-bold">Public Affairs</h1>
            <p className="text-sm opacity-90 mt-1">Official channels and PA support</p>
          </div>
        </div>
      </header>

      <section className="px-5 py-6 max-w-xl mx-auto space-y-4">
        <div className="space-y-3">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <Card className="p-4 flex items-center justify-between hover:bg-accent transition">
                <div className="flex items-center gap-3">
                  <ExternalLink className="size-5 text-primary shrink-0" />
                  <span className="font-medium">{link.name}</span>
                </div>
              </Card>
            </a>
          ))}
        </div>

        <Button asChild className="w-full" size="lg">
          <a
            href="https://safpa.appianportalsgov.com/request/group/public-affairs/page/new-request-paa"
            target="_blank"
            rel="noreferrer"
          >
            <Megaphone className="size-5" /> Request PA support
          </a>
        </Button>
      </section>
    </div>
  );
}
