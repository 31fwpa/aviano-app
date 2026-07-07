// Supabase Edge Function: send-push
//
// Broadcasts a push notification to every registered device via Firebase
// Cloud Messaging (FCM HTTP v1 API). Architecture + setup checklist:
// PUSH_NOTIFICATIONS.md in the repo root.
//
// Secrets required (Supabase dashboard → Edge Functions → Secrets):
//   FCM_SERVICE_ACCOUNT  full JSON of the Firebase service-account key
//   ADMIN_PUSH_KEY       shared secret; callers must send it as x-admin-key
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are injected automatically.
//
// Deploy:  npx supabase functions deploy send-push --no-verify-jwt
// (Auth is the x-admin-key header, not user JWTs — the app has no login.
//  See MAINTAINER_GUIDE.md §10.)
//
// Call:
//   curl -X POST https://<project>.supabase.co/functions/v1/send-push \
//     -H "content-type: application/json" -H "x-admin-key: <secret>" \
//     -d '{"title":"Gate closure","body":"North gate closed until 1800.","link":"/emergency"}'

import { createClient } from "jsr:@supabase/supabase-js@2";

type ServiceAccount = { project_id: string; client_email: string; private_key: string };

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-admin-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...CORS },
  });

const b64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const encodeSegment = (obj: unknown) => b64url(new TextEncoder().encode(JSON.stringify(obj)));

function pemToDer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  const raw = atob(b64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes.buffer;
}

// FCM v1 requires an OAuth2 access token derived from the service account:
// sign a short-lived JWT with the account's private key, then exchange it.
async function getFcmAccessToken(svc: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const unsigned =
    encodeSegment({ alg: "RS256", typ: "JWT" }) +
    "." +
    encodeSegment({
      iss: svc.client_email,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    });
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToDer(svc.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const jwt = unsigned + "." + b64url(new Uint8Array(sig));

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) throw new Error(`Google OAuth failed: ${res.status} ${await res.text()}`);
  const { access_token } = await res.json();
  return access_token;
}

type SendResult = "ok" | "invalid" | "error";

async function sendToDevice(
  projectId: string,
  accessToken: string,
  deviceToken: string,
  payload: { title: string; body: string; link?: string },
): Promise<SendResult> {
  const res = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
    method: "POST",
    headers: { authorization: `Bearer ${accessToken}`, "content-type": "application/json" },
    body: JSON.stringify({
      message: {
        token: deviceToken,
        notification: { title: payload.title, body: payload.body },
        data: payload.link ? { link: payload.link } : undefined,
        android: { priority: "HIGH" },
        apns: { headers: { "apns-priority": "10" } },
      },
    }),
  });
  if (res.ok) return "ok";
  const body = await res.text();
  // 404 UNREGISTERED: the app was uninstalled or the token rotated.
  // 400 INVALID_ARGUMENT: the token was never valid for FCM (e.g. a raw APNs
  // token stored before the Firebase iOS SDK was added). Either way: prune.
  if (res.status === 404 || (res.status === 400 && body.includes("INVALID_ARGUMENT"))) {
    return "invalid";
  }
  console.error(`[send-push] FCM error ${res.status}: ${body}`);
  return "error";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return json(405, { error: "POST only" });

  const adminKey = Deno.env.get("ADMIN_PUSH_KEY");
  if (!adminKey) return json(500, { error: "ADMIN_PUSH_KEY secret is not configured" });
  if (req.headers.get("x-admin-key") !== adminKey) return json(401, { error: "unauthorized" });

  let payload: { title?: unknown; body?: unknown; link?: unknown };
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: "body must be JSON" });
  }
  const { title, body, link } = payload;
  if (typeof title !== "string" || !title.trim() || title.length > 200) {
    return json(400, { error: "title: required string, max 200 chars" });
  }
  if (typeof body !== "string" || !body.trim() || body.length > 2000) {
    return json(400, { error: "body: required string, max 2000 chars" });
  }
  if (link !== undefined && (typeof link !== "string" || !link.startsWith("/"))) {
    return json(400, { error: "link: optional, must be an in-app path like /emergency" });
  }

  const svcRaw = Deno.env.get("FCM_SERVICE_ACCOUNT");
  if (!svcRaw) return json(500, { error: "FCM_SERVICE_ACCOUNT secret is not configured" });
  const svc: ServiceAccount = JSON.parse(svcRaw);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: rows, error: readError } = await supabase
    .from("device_push_tokens")
    .select("token");
  if (readError) return json(500, { error: `could not read tokens: ${readError.message}` });
  if (!rows?.length) return json(200, { sent: 0, failed: 0, pruned: 0, total: 0 });

  const accessToken = await getFcmAccessToken(svc);
  const message = { title: title.trim(), body: body.trim(), link: link as string | undefined };

  let sent = 0;
  let failed = 0;
  const invalid: string[] = [];
  const CHUNK = 50;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const results = await Promise.all(
      rows.slice(i, i + CHUNK).map(async ({ token }) => ({
        token,
        result: await sendToDevice(svc.project_id, accessToken, token, message),
      })),
    );
    for (const { token, result } of results) {
      if (result === "ok") sent++;
      else if (result === "invalid") invalid.push(token);
      else failed++;
    }
  }

  if (invalid.length) {
    await supabase.from("device_push_tokens").delete().in("token", invalid);
  }
  await supabase.from("notifications").insert({
    title: message.title,
    body: message.body,
    link: message.link ?? null,
    recipients_count: sent,
  });

  return json(200, { sent, failed, pruned: invalid.length, total: rows.length });
});
