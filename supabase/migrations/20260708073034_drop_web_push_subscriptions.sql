-- Retire the browser web-push table. Native apps register FCM tokens in
-- device_push_tokens instead (see PUSH_NOTIFICATIONS.md).
--
-- NOTE: Lovable's version of this migration also dropped public.notifications.
-- That table is deliberately KEPT: the send-push Edge Function writes a row to
-- it for every broadcast, which is the audit trail of what was sent to the
-- base and when. See MAINTAINER_GUIDE.md §10.
DROP TABLE IF EXISTS public.push_subscriptions CASCADE;
