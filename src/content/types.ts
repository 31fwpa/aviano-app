export type Announcement = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  published: boolean;
};

export type DirectoryEntry = {
  id: string;
  name: string;
  category: string;
  phone: string | null;
  email: string | null;
  hours: string | null;
  location: string | null;
  notes: string | null;
  sort_order: number;
  url: string | null;
};

export type EmergencyContact = {
  id: string;
  label: string;
  phone: string;
  category: string;
  notes: string | null;
  sort_order: number;
};

export type ImportantNumberEntry = {
  name: string;
  phone: string;
  extension?: string;
};

export type ImportantNumbersSection = {
  section_enabled: boolean;
  entries: ImportantNumberEntry[];
};

export type AfpaasSection = {
  section_enabled: boolean;
  name: string;
  url: string;
};

export type ResourceEntry = {
  name: string;
  url: string;
};

export type ResourcesSection = {
  section_enabled: boolean;
  entries: ResourceEntry[];
};

export type EmergencyContent = {
  er_name?: string;
  er_address?: string;
  er_lat?: string;
  er_lng?: string;
  guidance?: string;
  important_numbers?: ImportantNumbersSection;
  afpaas?: AfpaasSection;
  resources?: ResourcesSection;
  [key: string]: unknown;
};