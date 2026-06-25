ALTER TABLE public.directory_entries ADD COLUMN url TEXT;

COMMENT ON COLUMN public.directory_entries.url IS 'Optional external link for the entry (e.g. clinic website, Notion page).';
