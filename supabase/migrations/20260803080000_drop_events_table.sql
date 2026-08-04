-- Operational calendar was removed; the app now loads only the recreational
-- Google Calendar iframe. Drop the unused events table and enum.
DROP TABLE IF EXISTS public.events CASCADE;
DROP TYPE IF EXISTS public.event_type CASCADE;
