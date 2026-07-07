// Native push notification registration (Phase 3).
//
// Runs only inside the Capacitor apps (iOS/Android) — never in a browser.
// On launch we ask the OS for notification permission, register with the
// platform's push service, and store the resulting device token in the
// device_push_tokens table so the send-push Edge Function can reach this
// device. See PUSH_NOTIFICATIONS.md for the full architecture.
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { supabase } from "@/integrations/supabase/client";

// Postgres error code for "row already exists" — the token is already
// registered, which for our purposes is success.
const DUPLICATE_ROW = "23505";

export async function initNativePush(onNotificationTap: (link: string) => void) {
  if (!Capacitor.isNativePlatform()) return;

  try {
    let status = await PushNotifications.checkPermissions();
    if (status.receive === "prompt" || status.receive === "prompt-with-rationale") {
      status = await PushNotifications.requestPermissions();
    }
    if (status.receive !== "granted") return; // user said no — respect it

    await PushNotifications.addListener("registration", async ({ value: token }) => {
      const { error } = await supabase
        .from("device_push_tokens")
        .insert({ token, platform: Capacitor.getPlatform() });
      if (error && error.code !== DUPLICATE_ROW) {
        console.error("[push] failed to store device token", error);
      }
    });

    await PushNotifications.addListener("registrationError", (err) => {
      console.error("[push] registration failed", err);
    });

    // A notification was tapped (app in background or closed) — follow its
    // link if the sender attached one.
    await PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
      const link = action.notification.data?.link;
      if (typeof link === "string" && link.startsWith("/")) onNotificationTap(link);
    });

    await PushNotifications.register();
  } catch (err) {
    // Push is a bonus feature — never let it break the app (the emergency
    // screens must load even if registration fails or config is missing).
    console.error("[push] init failed", err);
  }
}
