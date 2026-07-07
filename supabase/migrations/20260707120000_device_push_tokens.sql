-- Native device push tokens (Phase 3 — FCM registration tokens).
-- The older push_subscriptions table holds web-push (VAPID) browser
-- subscriptions; native apps store their FCM tokens here instead.
CREATE TABLE public.device_push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.device_push_tokens ENABLE ROW LEVEL SECURITY;

-- Any device may register itself (insert only, with sane token lengths).
CREATE POLICY "devices can register" ON public.device_push_tokens
FOR INSERT WITH CHECK (length(token) BETWEEN 20 AND 4096);

-- Only admins may read or delete. The send-push Edge Function uses the
-- service role key, which bypasses RLS, so it needs no extra policy.
CREATE POLICY "admin read device tokens" ON public.device_push_tokens
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete device tokens" ON public.device_push_tokens
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
