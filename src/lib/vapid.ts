// VAPID public key is safe to ship in the client bundle (it's literally public).
export const VAPID_PUBLIC_KEY =
  "BDeoNJ0To_QV48jn616A1WOHS9q_AKzDIW7zCOsOmDxePfxzPHmLbz7jDCuEliYoG3jmNob84rBdnUYDa9Us49A";

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}