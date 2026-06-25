
-- Fix mutable search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- has_role is meant to be called from policies (which run as definer context anyway). Lock down direct calls.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;

-- Tighten push insert: require non-empty fields
DROP POLICY IF EXISTS "anyone can subscribe" ON public.push_subscriptions;
CREATE POLICY "anyone can subscribe" ON public.push_subscriptions
FOR INSERT
WITH CHECK (
  length(endpoint) > 10 AND length(p256dh) > 0 AND length(auth) > 0
);
