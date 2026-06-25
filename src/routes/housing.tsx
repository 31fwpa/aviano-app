import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Home } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/housing")({
  head: () => ({
    meta: [
      { title: "Housing Support — Aviano Air Base" },
      { name: "description", content: "Housing, Home Fuels, FMO, and TMO resources for Aviano Air Base." },
    ],
  }),
  component: HousingPage,
});

type Item = { title: string; url: string };
type Folder = { folder: string; items: Item[] };
type Section = { label: string; children: Folder[] };

const sections: Section[] = [
  {
    label: "Home Fuels",
    children: [
      { folder: "Aviano Home Fuels Website", items: [{ title: "Website", url: "https://www.avianohomefuels.com" }] },
      { folder: "Pay Online", items: [{ title: "Pay Online", url: "https://www.starnik.net/UtilityTrakR/UT6/Current/R_default.aspx" }] },
      { folder: "Appointment Sign-In", items: [{ title: "Appointment Sign-In", url: "https://www.queuekiosk.com/webaccess/?QID=65&QTKN=avh83kk8s3jh32" }] },
    ],
  },
  {
    label: "Housing",
    children: [
      { folder: "Appointment Sign-In", items: [{ title: "Appointment Sign-In", url: "https://qkonline.queuekiosk.com/?QID=65&QTKN=avh83kk8s3jh32" }] },
      { folder: "Aviano AB Housing", items: [{ title: "Aviano AB Housing", url: "https://www.housing.af.mil/Home/Units/Aviano/" }] },
      { folder: "Homes.mil", items: [{ title: "Homes.mil", url: "https://www.homes.mil/homes/DispatchServlet/HomesEntry" }] },
      {
        folder: "Housing PDFs",
        items: [
          { title: "Rental Agreement", url: "https://s3-us-gov-west-1.amazonaws.com/afconnectcms/uploads/1064/images/thumb/references/pdf/COMMUNITYHOUSINGRENTALAGREEMENTfinalversion21Feb2024002.pdf" },
          { title: "Premises Condition Inventory", url: "https://s3-us-gov-west-1.amazonaws.com/afconnectcms/uploads/1064/images/thumb/references/pdf/AvianoPremisesConditionInventoryForm_1648801587.pdf" },
          { title: "Quarters Visited Form", url: "https://s3-us-gov-west-1.amazonaws.com/afconnectcms/uploads/1064/images/thumb/references/pdf/DormitoryHousingUHBrochurevs3August242updated.pdf" },
          { title: "Dorm Brochure", url: "https://s3-us-gov-west-1.amazonaws.com/afconnectcms/uploads/1064/images/thumb/references/pdf/DormitoryHousingUHBrochurevs3August242updated.pdf" },
        ],
      },
      { folder: "Recycling", items: [{ title: "Recycling", url: "https://31fss.com/off-base-recycling/" }] },
    ],
  },
  {
    label: "Furnishings Management Office",
    children: [
      {
        folder: "FMO",
        items: [
          { title: "Furnishing Management", url: "https://aviano.usaf.afpims.mil/Portals/1/Housing/P3S4%20FMS%20updated.pdf?ver=zRePb_TcDWW5lIAXjctKLA%3d%3d" },
          { title: "Appliance Manuals", url: "https://s3-us-gov-west-1.amazonaws.com/afconnectcms/uploads/1064/images/thumb/references/pdf/APPLIANCEMANUALS2022_1648802731.pdf" },
        ],
      },
    ],
  },
  {
    label: "Traffic Management Office",
    children: [
      { folder: "TMO Website", items: [{ title: "TMO", url: "https://www.31fss.com/shipping-household-goods" }] },
    ],
  },
];

function HousingPage() {
  return (
    <div className="px-5 py-6 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Home className="size-6 text-primary" />
        <h1 className="text-2xl font-bold">Housing Support</h1>
      </div>
      <div className="space-y-6">
        {sections.map((s) => (
          <section key={s.label}>
            <h2 className="font-semibold text-lg mb-2">{s.label}</h2>
            <div className="space-y-3">
              {s.children.map((f) => (
                <Card key={f.folder} className="p-4">
                  <p className="font-medium text-sm text-muted-foreground mb-2">{f.folder}</p>
                  <ul className="space-y-1.5">
                    {f.items.map((item) => (
                      <li key={item.url + item.title}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <ExternalLink className="size-4 shrink-0" />
                          <span>{item.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}