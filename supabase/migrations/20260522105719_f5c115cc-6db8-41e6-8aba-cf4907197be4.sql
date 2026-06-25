
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users view own roles" ON public.user_roles
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "admins manage roles" ON public.user_roles
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Reusable updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Directory
CREATE TABLE public.directory_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  phone TEXT,
  email TEXT,
  hours TEXT,
  location TEXT,
  notes TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.directory_entries ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_directory_updated BEFORE UPDATE ON public.directory_entries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "public read directory" ON public.directory_entries FOR SELECT USING (true);
CREATE POLICY "admin write directory" ON public.directory_entries FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Events
CREATE TYPE public.event_type AS ENUM ('operational', 'recreational');

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type event_type NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  location TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_events_updated BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "admin write events" ON public.events FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Emergency contacts
CREATE TABLE public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  phone TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Base',
  notes TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_em_contacts_updated BEFORE UPDATE ON public.emergency_contacts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "public read em contacts" ON public.emergency_contacts FOR SELECT USING (true);
CREATE POLICY "admin write em contacts" ON public.emergency_contacts FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Emergency content (key/value)
CREATE TABLE public.emergency_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.emergency_content ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_em_content_updated BEFORE UPDATE ON public.emergency_content
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "public read em content" ON public.emergency_content FOR SELECT USING (true);
CREATE POLICY "admin write em content" ON public.emergency_content FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Announcements
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_ann_updated BEFORE UPDATE ON public.announcements
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "public read announcements" ON public.announcements
FOR SELECT USING (published = true);
CREATE POLICY "admin write announcements" ON public.announcements FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Push subscriptions
CREATE TABLE public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (insert); only admins read/delete. Updates allowed for refresh by endpoint match (open insert is fine since endpoint is unique).
CREATE POLICY "anyone can subscribe" ON public.push_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read subscriptions" ON public.push_subscriptions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete subscriptions" ON public.push_subscriptions FOR DELETE TO authenticated
USING (public.has_role(auth.uid(),'admin'));

-- Notifications history
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  recipients_count INT NOT NULL DEFAULT 0
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin read notifications" ON public.notifications FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin write notifications" ON public.notifications FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(),'admin'));
