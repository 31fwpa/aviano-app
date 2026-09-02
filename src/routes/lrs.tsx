import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Package,
  Plane,
  Shield,
  Search,
  FileText,
  ExternalLink,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { resolveDocument, isInAppDocument } from "@/lib/documents";

export const Route = createFileRoute("/lrs")({
  head: () => ({
    meta: [
      { title: "31st LRS — Aviano AB" },
      {
        name: "description",
        content:
          "Personal property, passenger travel, and individual protective equipment resources from the 31st Logistics Readiness Squadron at Aviano Air Base.",
      },
      { property: "og:title", content: "31st LRS — Aviano AB" },
      {
        property: "og:description",
        content:
          "PCS, HHG, pet travel, DPS, DTS, and IPE resources for Aviano Air Base personnel.",
      },
    ],
  }),
  component: LrsPage,
});

type Resource =
  | { label: string; pdf: string; note?: string }
  | { label: string; href: string; note?: string };

type SubGroup = { title: string; items: Resource[] };

type Section = {
  id: string;
  title: string;
  Icon: typeof Package;
  groups: SubGroup[];
};

// The `pdf` value is the document's filename. It resolves to a published URL
// via src/content/documents.json; unpublished files render as "Coming soon".
const sections: Section[] = [
  {
    id: "personal-property",
    title: "Personal Property",
    Icon: Package,
    groups: [
      {
        title: "DPS",
        items: [
          {
            label: "DPS Login Page",
            href: "https://dps.move.mil/cust/standard/user/home.xhtml",
          },
        ],
      },
      {
        title: "Required Documents",
        items: [
          { label: "Wine / Alcohol / Motorcycle", pdf: "WineRequiredDocumentsCombined_1681991284.pdf" },
          { label: "Customs & Agriculture", pdf: "Customs & Agriculture.pdf" },
          { label: "Personally Procured Move (PPM)", pdf: "Personally Procured Move (PPM).pdf" },
          { label: "Household Goods (HHG)", pdf: "Household Goods (HHG).pdf" },
          { label: "Unaccompanied Baggage (UB)", pdf: "Unaccompanied Baggage (UB).pdf" },
          { label: "Date Change Request", pdf: "Date Change Request.pdf" },
          {
            label: "Stateside Authorizations for Alcohol",
            href: "https://www.ttb.gov/wine/alcohol-beverage-control-boards",
          },
        ],
      },
      {
        title: "Claims",
        items: [
          { label: "Inconvenience Claims", pdf: "Inconvenience Claims.pdf" },
          { label: "Loss & Damage Claims", pdf: "Loss & Damage Claims.pdf" },
          { label: "POV Inconvenience Claims", pdf: "POV Inconvenience Claims.pdf" },
        ],
      },
      {
        title: "Weight Allowances",
        items: [
          { label: "PCS and NTS Weight Allowance", pdf: "PCS and NTS Weight Allowance.pdf" },
          {
            label: "Unaccompanied Baggage Weight Allowance",
            pdf: "Unaccompanied Baggage Weight Allowance.pdf",
          },
          {
            label: "Exceptions to HHG Weight Allowances",
            pdf: "Exceptions to HHG Weight Allowances.pdf",
          },
          { label: "TDY Weight Allowances", pdf: "TDY Weight Allowances.pdf" },
        ],
      },
    ],
  },
  {
    id: "passenger-travel",
    title: "Passenger Travel",
    Icon: Plane,
    groups: [
      {
        title: "Circuitous Travel",
        items: [
          {
            label: "Circuitous Travel Process",
            pdf: "CIRCUITOUSTRAVELPROCESS_1682603952.pdf",
            note: "coming soon",
          },
          { label: "Circuitous Travel Memo", pdf: "CircuitousTravelMemo_1682603951.pdf" },
          {
            label: "Travel Authorization (JTR & AFI 24-602v1)",
            pdf: "Travel Authorization (JTR & AFI 24-602v1).pdf",
          },
        ],
      },
      {
        title: "COT Travel",
        items: [
          // Port call SharePoint removed — CAC-locked, confirmed on device.
          // Passenger Travel (in the Directory) submits these by phone.
          // DTS link removed: tested on device, it fails from Aviano on both
          // base wifi (hangs) and cellular (ERR_CONNECTION_RESET). Use DTS
          // from a government computer.
          { label: "Travel Authorizations (JTR)", pdf: "Travel Authorizations (JTR) (COT Travel).pdf" },
        ],
      },
      {
        title: "Emergency Leave",
        items: [
          { label: "Emergency Leave Process", pdf: "Emergency Leave Process.pdf" },
          { label: "AF Form 972, Emergency Leave Order", pdf: "AF Form 972, Emergency Leave Order.pdf" },
          { label: "Port Call Request Form", pdf: "Port Call Request Form.pdf" },
          { label: "Travel Authorizations (JTR)", pdf: "Travel Authorizations (JTR) (Emergency Leave).pdf" },
        ],
      },
      {
        title: "Leave-in-Conjunction with TDY",
        items: [
          { label: "Leave-in-Conjunction with TDY Process", pdf: "Leave-in-Conjunction with TDY Process.pdf" },
          {
            label: "Leave-in-Conjunction with TDY Memo",
            pdf: "LeaveinConjunctionwithTDYSelfProcuringTransoceanic_1682603127.pdf",
          },
          { label: "Travel Authorizations (JTR)", pdf: "Travel Authorizations (JTR) (Leave-in-Conjunction).pdf" },
        ],
      },
      {
        title: "PCS / SEP / RET Travel",
        items: [
          { label: "Travel Request Process", pdf: "Travel Request Process.pdf" },
          // Port call SharePoint removed — CAC-locked, confirmed on device.
          // Passenger Travel (in the Directory) submits these by phone.
        ],
      },
      {
        title: "Pet Travel",
        items: [
          { label: "IATA Pet Container Requirements", pdf: "IATA Pet Container Requirements.pdf" },
          { label: "Pet Expense Reimbursement (1 Jan 24)", pdf: "Pet Expense Reimbursement (1 Jan 24).pdf" },
          {
            label: "DTMO Guidance for Pet Travel Expense",
            href: "https://www.travel.dod.mil/Support/ALL-FAQs/Article/3624131/pet-transportation-allowance/",
          },
          {
            label: "Travelling with Pets — Lufthansa",
            href: "https://www.lufthansa.com/br/en/travelling-with-animals",
          },
          {
            label: "Lufthansa Policy for Fighting & Snub Nose Breeds",
            href: "https://www.lufthansa.com/br/en/dangerous-dogs",
          },
          { label: "AMC Pet Pamphlet", pdf: "AMC Pet Pamphlet.pdf" },
          { label: "AMC Non-Availability Letter", pdf: "AMC Non-Availability Letter.pdf" },
          { label: "Pet Travel Guidance (1 Aug 24)", pdf: "Pet Travel Guidance -1 Aug 24-.pdf" },
          { label: "CDC Entry Requirements", pdf: "CDC Entry Requirements.pdf" },
          { label: "CDC Regulation Update", pdf: "CDC Regulation Update.pdf" },
          { label: "Importer Info — Air Entry", pdf: "Importer Info_Air Entry.pdf" },
          { label: "Importer Info — Land Entry", pdf: "Importer Info_Land Entry.pdf" },
          { label: "Importer Info — Sea Entry", pdf: "Importer Info_Sea Entry.pdf" },
        ],
      },
      {
        title: "TDY / Deployment Travel",
        items: [
          // DTS link removed: tested on device, it fails from Aviano on both
          // base wifi (hangs) and cellular (ERR_CONNECTION_RESET). Use DTS
          // from a government computer.
        ],
      },
      {
        title: "Self-Procurement of Travel",
        items: [
          {
            label: "Self Procurement Policy",
            pdf: "Self Procurement Policy.pdf",
          },
          { label: "JTR Reference Para 020207-G", pdf: "JTR Reference Para 020207-G.pdf" },
        ],
      },
      {
        title: "Memo Templates",
        items: [
          { label: "CBA Request Memo", pdf: "CBA Request Memo.pdf" },
          { label: "Circuitous Travel Memo", pdf: "CircuitousTravelMemo_1680009961.pdf" },
          {
            label: "Leave-in-Conjunction with TDY Memo",
            pdf: "LeaveinConjunctionwithTDYSelfProcuringTransoceanic_1680010626.pdf",
          },
          { label: "Verbal Order (VOCO)", pdf: "Verbal Order (VOCO).pdf" },
          {
            label: "Port Call (MDG, GSUs, TDY, E-Leave use only)",
            pdf: "Port Call (MDG, GSUs, TDY, E-Leave use only).pdf",
          },
          { label: "Pet AMC Non-Availability Memo", pdf: "AMC Non-Availability Letter.pdf" },
        ],
      },
    ],
  },
  {
    id: "ipe",
    title: "Individual Protective Equipment",
    Icon: Shield,
    groups: [
      {
        title: "Mobility Customer Pin",
        items: [
          // Removed after on-device testing: ils-s.cce.af.mil presents a
          // certificate error on consumer phones (DoD root CA is not in their
          // trust store), so the link offers users a "proceed (unsafe)" warning.
          { label: "Set up (Non-ILS-S users)", pdf: "Set up (Non-ILS-S users).pdf" },
          { label: "Set up (ILS-S users)", pdf: "Set up (ILS-S users).pdf" },
        ],
      },
      {
        title: "Contact & Location",
        items: [{ label: "Contact / Location Info", pdf: "IPEContactLocation_1691657562.pdf" }],
      },
      {
        title: "Set an Appointment",
        items: [
          {
            label: "Appointment Sign-up",
            href: "https://waitwhile.com/accounts/ipemobility?gr=true",
          },
        ],
      },
    ],
  },
];



function LrsPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((s) => ({
        ...s,
        groups: s.groups
          .map((g) => ({
            ...g,
            items: g.items.filter(
              (i) =>
                i.label.toLowerCase().includes(q) ||
                g.title.toLowerCase().includes(q) ||
                s.title.toLowerCase().includes(q),
            ),
          }))
          .filter((g) => g.items.length > 0),
      }))
      .filter((s) => s.groups.length > 0);
  }, [query]);

  const defaultOpen = query.trim() ? filtered.map((s) => s.id) : ["personal-property"];

  return (
    <div>
      <header className="bg-gradient-to-br from-[oklch(0.25_0.08_255)] to-[oklch(0.4_0.1_255)] text-white px-5 pt-10 pb-6">
        <p className="text-xs uppercase tracking-widest opacity-80">31st Fighter Wing</p>
        <h1 className="text-2xl font-bold mt-1 leading-tight">
          Logistics Readiness Squadron
        </h1>
        <p className="opacity-90 mt-2 text-sm">
          Personal property, passenger travel, and IPE resources.
        </p>
      </header>

      <section className="px-5 py-5 max-w-xl mx-auto space-y-4">
        <div className="relative">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources…"
            className="pl-9"
          />
        </div>

        <Accordion
          type="multiple"
          defaultValue={defaultOpen}
          key={query}
          className="space-y-2"
        >
          {filtered.map(({ id, title, Icon, groups }) => (
            <AccordionItem
              key={id}
              value={id}
              className="border border-border rounded-lg bg-card px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Icon className="size-5 text-primary" />
                  <span className="font-semibold text-base">{title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4">
                  {groups.map((g) => (
                    <div key={g.title}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        {g.title}
                      </p>
                      <ul className="space-y-1.5">
                        {g.items.map((item) => (
                          <li key={item.label}>
                            <ResourceLink item={item} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No resources match "{query}".
          </p>
        )}

      </section>
    </div>
  );
}

function ResourceLink({ item }: { item: Resource }) {
  if ("href" in item) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 py-2 px-3 -mx-1 rounded-md hover:bg-accent transition text-sm"
      >
        <ExternalLink className="size-4 shrink-0 text-primary" />
        <span className="flex-1">{item.label}</span>
      </a>
    );
  }
  const url = resolveDocument(item.pdf);
  if (!url) {
    return (
      <div className="flex items-center gap-2 py-2 px-3 -mx-1 rounded-md text-sm opacity-60">
        <FileText className="size-4 shrink-0" />
        <span className="flex-1">{item.label}</span>
        <Badge variant="secondary" className="text-[10px]">
          Coming soon
        </Badge>
      </div>
    );
  }
  const rowClass =
    "flex items-center gap-2 py-2 px-3 -mx-1 rounded-md hover:bg-accent transition text-sm";
  // Documents bundled in the app open in the in-app viewer (works offline);
  // anything else is a website link and leaves for the in-app browser.
  if (isInAppDocument(url)) {
    return (
      <Link to="/document" search={{ doc: url.split("doc=")[1], title: item.label }} className={rowClass}>
        <FileText className="size-4 shrink-0 text-primary" />
        <span className="flex-1">{item.label}</span>
      </Link>
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={rowClass}>
      <FileText className="size-4 shrink-0 text-primary" />
      <span className="flex-1">{item.label}</span>
    </a>
  );
}