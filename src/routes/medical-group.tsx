import { createFileRoute } from "@tanstack/react-router";
import {
  Clock,
  Heart,
  AlertTriangle,
  Pill,
  Brain,
  Stethoscope,
  FlaskConical,
  Globe,
  Users,
  Megaphone,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { resolveDocument } from "@/lib/documents";

export const Route = createFileRoute("/medical-group")({
  head: () => ({
    meta: [
      { title: "31st Medical Group — Aviano AB" },
      {
        name: "description",
        content:
          "Clinic hours, services, announcements, and contact information for the 31st Medical Group at Aviano Air Base.",
      },
    ],
  }),
  component: MedicalGroupPage,
});

const clinicHours = [
  { label: "General Clinic Hours", time: "0730–1630, Monday–Friday" },
  { label: "Appointment Line", time: "0700–1600, Monday–Friday" },
];

type LinkItem = { label: string; href?: string; tel?: string };

const announcements: LinkItem[] = [
  { label: "June Closures", href: resolveDocument("JuneClosures.png") },
  { label: "Updated Pharmacy Hours", href: resolveDocument("PharmacyUpdate.png") },
  { label: "Sports Physicals", href: resolveDocument("SportsPhysicals.jpg") },
  { label: "Lab Results sooner", href: resolveDocument("DHAresults.jpeg") },
  { label: "When to Call the Pediatrician", href: resolveDocument("WhentocallthePediatrician2.jpg") },
  { label: "Smoking cessation", href: resolveDocument("image001.png") },
  { label: "Mental Health Classes", href: resolveDocument("MHClasses.jpg") },
];

const generalInfo: LinkItem[] = [
  { label: "31 MDG General Information", href: resolveDocument("AFConnectSlideGeneralInformation.jpg") },
  { label: "Scheduling an Appointment", href: resolveDocument("AFConnectSlideSchedulingAppointments.jpg") },
  {
    label: "Patient Rights and Responsibilities",
    href: "https://aviano.tricare.mil/Patient-Resources/Patient-Rights-Responsibilities",
  },
  {
    label: "HIPAA Notice of Privacy Practices",
    href: resolveDocument("MHSNoticeofPrivacyPractices16February2026.pdf"),
  },
  { label: "31 MDG Tricare Website", href: "https://aviano.tricare.mil/" },
  { label: "MyCare Overseas", href: resolveDocument("MyCareOverseasFactsheetAugust2024.pdf") },
];

const emergencyUrgentCare: LinkItem[] = [
  { label: "Emergency and Urgent Care Overview", href: resolveDocument("AFConnectSlideERUrgentinfo.jpg") },
  { label: "Pordenone Hospital Map and Location", href: resolveDocument("AFConnectSlidePordenoneERMap.jpg") },
  { label: "Pordenone ER Adult Information", href: resolveDocument("AFConnectSlidePordenoneERInfo.jpg") },
  { label: "Pordenone Pediatric ER and OB Care", href: resolveDocument("AFConnectSlideERPeds.jpg") },
  { label: "Translation/Patient Liaison: Pordenone Hospital", href: resolveDocument("AFConnectSlidePatientLiaison.jpg") },
];

const primaryCare: LinkItem[] = [
  { label: "Family Medicine", href: resolveDocument("AFConnectFamilyMedicine.jpg") },
  { label: "Pediatrics Clinic (0–17 years)", href: resolveDocument("AFConnectPediatrics.jpg") },
  { label: "Warrior Operational Medicine Clinic (WOMC – AD only)", href: resolveDocument("AFConnectWOMC.jpg") },
  { label: "Flight Medicine (Flight status and Fire ONLY)", href: resolveDocument("AFConnectFlightmedicine.jpg") },
  { label: "PRAP Clinic (PRP and Arming Use of Force (AUoF) ONLY)", href: resolveDocument("AFConnectPRP.jpg") },
];

const specialtyClinics: LinkItem[] = [
  { label: "Women's Health Clinic", href: resolveDocument("AFConnectSlideWomensHealth.jpg") },
  { label: "Walk-In Contraception (WiCs)", href: resolveDocument("WiCS.png") },
  { label: "Dental Clinic", href: resolveDocument("AFConnectSlideDental.jpg") },
  { label: "Optometry Clinic", href: resolveDocument("AFConnectOptometryClinic.jpg") },
  { label: "Immunization Clinic", href: resolveDocument("AFConnectImmunizationClinic.jpg") },
];

const mentalHealth: LinkItem[] = [
  { label: "Mental Health Clinic", href: resolveDocument("AFConnectMentalHealthClinic.jpg") },
  { label: "Family Advocacy", href: resolveDocument("AFConnectFamilyAdvocacy.jpg") },
  { label: "ADAPT Program", href: resolveDocument("AFConnectADAPT.jpg") },
  {
    label: "Aviano Mental Health Website Link",
    href: "https://aviano.tricare.mil/Health-Services/Mental-Health",
  },
  { label: "Suicide Prevention: +1 844-702-5495", tel: "+18447025495" },
];

const ancillaryServices: LinkItem[] = [
  { label: "Laboratory", href: resolveDocument("AFConnectLab.jpg") },
  { label: "Radiology", href: resolveDocument("AFConnectRadiology.pdf") },
  { label: "EFMP", href: resolveDocument("AFConnectSlideEFMP.jpg") },
  { label: "Medical Records", href: resolveDocument("RequestingMedicalRecords.pdf") },
  { label: "Patient Travel Office", href: resolveDocument("PatientTravelPTinfo.pdf") },
  { label: "Referral Management", href: resolveDocument("RMCPatientInformation.pdf") },
];

const pharmacy: LinkItem[] = [
  { label: "General Pharmacy Information", href: resolveDocument("AFConnectPharmacy.jpg") },
  { label: "Refills & Prescription Transfers", href: resolveDocument("AFConnectPharmacyRefillsandTransfers.jpg") },
  { label: "Express Scripts Home Delivery", href: resolveDocument("AFConnectPharmacyExpressScripts.jpg") },
  { label: "Filling an Italian Prescription with Sample", href: resolveDocument("AFConnectPrescriptionInformation.jpg") },
];

const patientAdvocate: LinkItem[] = [
  {
    label: "Patient Advocate",
    href: "https://s3-us-gov-west-1.amazonaws.com/afconnectcms/uploads/1064/images/thumb/references/pdf/AFConnectPatientAdvocate.jpg",
  },
  {
    label: "ICE Comments: +/- Feedback",
    href: "https://ice.disa.mil/index.cfm?fa=card&sp=123023",
  },
];

function HoursSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="size-5 text-primary" />
          Clinic Hours of Operation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {clinicHours.map((entry) => (
          <div
            key={entry.label}
            className="border-b border-border last:border-0 pb-3 last:pb-0"
          >
            <p className="font-medium">{entry.label}</p>
            <p className="text-muted-foreground">{entry.time}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function LinkButton({ item, icon: Icon, iconClass }: { item: LinkItem; icon: React.ElementType; iconClass?: string }) {
  const href = item.tel ? `tel:${item.tel}` : item.href;
  if (href) {
    return (
      <Button
        variant="outline"
        className="w-full justify-start gap-2 text-left h-auto py-3"
        asChild
      >
        <a href={href} target={item.tel ? undefined : "_blank"} rel="noopener noreferrer">
          <Icon className={`size-4 shrink-0 ${iconClass ?? "text-primary"}`} />
          <span className="break-words">{item.label}</span>
        </a>
      </Button>
    );
  }
  return (
    <Button
      variant="outline"
      disabled
      className="w-full justify-start gap-2 text-left h-auto py-3 opacity-70"
      title="Link not yet available"
    >
      <AlertCircle className="size-4 shrink-0 text-amber-500" />
      <span className="break-words">{item.label}</span>
      <span className="ml-auto text-[10px] uppercase tracking-wide text-amber-600 font-semibold shrink-0">
        Link pending
      </span>
    </Button>
  );
}

function AnnouncementsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="size-5 text-primary" />
          Announcements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {announcements.map((item) => (
            <li key={item.label}>
              <LinkButton item={item} icon={Megaphone} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function LinkList({ items, icon: Icon, iconClass }: { items: LinkItem[]; icon: React.ElementType; iconClass?: string }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.label}>
          <LinkButton item={item} icon={Icon} iconClass={iconClass} />
        </li>
      ))}
    </ul>
  );
}

function ServicesSection() {
  const sections = [
    {
      title: "General Information",
      icon: Globe,
      iconClass: "text-blue-500",
      items: generalInfo,
    },
    {
      title: "Emergency & Urgent Care",
      icon: AlertTriangle,
      iconClass: "text-red-500",
      items: emergencyUrgentCare,
    },
    {
      title: "Primary Care",
      icon: Stethoscope,
      iconClass: "text-green-600",
      items: primaryCare,
    },
    {
      title: "Specialty Clinics",
      icon: Heart,
      iconClass: "text-pink-500",
      items: specialtyClinics,
    },
    {
      title: "Mental Health Resources",
      icon: Brain,
      iconClass: "text-purple-500",
      items: mentalHealth,
    },
    {
      title: "Ancillary Services",
      icon: FlaskConical,
      iconClass: "text-teal-500",
      items: ancillaryServices,
    },
    {
      title: "Pharmacy",
      icon: Pill,
      iconClass: "text-cyan-600",
      items: pharmacy,
    },
    {
      title: "Patient Advocate & Feedback",
      icon: Users,
      iconClass: "text-indigo-500",
      items: patientAdvocate,
    },
  ];

  return (
    <div className="space-y-4">
      {sections.map(({ title, icon: Icon, iconClass, items }) => (
        <Card key={title}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon className={`size-5 ${iconClass}`} />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LinkList items={items} icon={ExternalLink} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


function MedicalGroupPage() {
  return (
    <div>
      <header className="bg-primary text-primary-foreground px-5 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <Stethoscope className="size-7" />
          <div>
            <h1 className="text-2xl font-bold">31 MDG</h1>
            <p className="text-sm opacity-90 mt-1">
              31st Medical Group — Aviano AB
            </p>
          </div>
        </div>
      </header>

      <section className="px-5 py-6 max-w-xl mx-auto space-y-6">
        <Tabs defaultValue="hours">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="hours">Hours</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="hours" className="mt-4">
            <HoursSection />
          </TabsContent>

          <TabsContent value="news" className="mt-4">
            <AnnouncementsSection />
          </TabsContent>

          <TabsContent value="services" className="mt-4">
            <ServicesSection />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
