import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Phone, Mail, ExternalLink, FileText, HeartHandshake } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { resolveDocument, isInAppDocument } from "@/lib/documents";

export const Route = createFileRoute("/mfrc")({
  head: () => ({
    meta: [
      { title: "Military & Family Readiness Center — Aviano AB" },
      {
        name: "description",
        content:
          "M&FRC contact details, Key Spouse programme, and Military Family Life Counselors at Aviano Air Base.",
      },
    ],
  }),
  component: MfrcPage,
});

// Contact details mirror the directory entries in src/content/directory.json.
const MFRC = {
  phoneDisplay: "0434 30 5407",
  phoneDial: "0434305407",
  email: "31fss.fsfr.1@us.af.mil",
  website: "https://31fss.com/military-family-readiness-center",
};

// The MFLCs are a separate, confidential service — worth surfacing here
// because people look for them under family support, not "counseling".
const counselors = [
  { label: "Military Family Life Counselor — Adult", display: "393 378 2707", dial: "3933782707" },
  { label: "Military Family Life Counselor — Child", display: "392 612 5364", dial: "3926125364" },
];

function MfrcPage() {
  const keySpouse = resolveDocument("Key Spouse.pdf");

  return (
    <div>
      <header className="bg-primary text-primary-foreground px-5 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <Users className="size-7" />
          <div>
            <h1 className="text-2xl font-bold">M &amp; FRC</h1>
            <p className="text-sm opacity-90 mt-1">
              Military &amp; Family Readiness Center
            </p>
          </div>
        </div>
      </header>

      <section className="px-5 py-6 max-w-xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="size-5 text-primary" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <a href={`tel:${MFRC.phoneDial}`}>
                <Phone className="size-4 text-primary" />
                {MFRC.phoneDisplay}
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <a href={`mailto:${MFRC.email}`}>
                <Mail className="size-4 text-primary" />
                <span className="break-all">{MFRC.email}</span>
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <a href={MFRC.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4 text-primary" />
                Hours &amp; programmes on 31fss.com
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartHandshake className="size-5 text-primary" />
              Key Spouse Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            {keySpouse && isInAppDocument(keySpouse) ? (
              <Button variant="outline" className="w-full justify-start gap-3 text-left h-auto py-3" asChild>
                <Link to="/document" search={{ doc: keySpouse.split("doc=")[1], title: "Key Spouse Program" }}>
                  <FileText className="size-4 shrink-0 text-primary" />
                  <span className="break-words">Key Spouse information</span>
                </Link>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">Coming soon.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5 text-primary" />
              Military Family Life Counselors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {counselors.map((c) => (
              <Button
                key={c.dial}
                variant="outline"
                className="w-full justify-start gap-3 text-left h-auto py-3"
                asChild
              >
                <a href={`tel:${c.dial}`}>
                  <Phone className="size-4 shrink-0 text-primary" />
                  <span className="flex-1 min-w-0">
                    <span className="block break-words whitespace-normal">{c.label}</span>
                    <span className="block text-sm font-semibold text-primary mt-0.5">
                      {c.display}
                    </span>
                  </span>
                </a>
              </Button>
            ))}
            <p className="text-xs text-muted-foreground pt-1">
              For emergencies 24/7, contact the on-duty Chaplain at 0434-30-3100.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
