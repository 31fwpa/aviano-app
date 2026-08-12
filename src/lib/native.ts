import { Capacitor } from "@capacitor/core";

// The splash is configured with launchAutoHide: false, so it stays up until we
// dismiss it. If dismissal never ran the app would look frozen, so every path
// below is guarded and a failsafe timer hides it regardless.
const SPLASH_FAILSAFE_MS = 5000;
let splashHidden = false;

function hideSplash() {
  if (splashHidden) return;
  splashHidden = true;
  void import("@capacitor/splash-screen")
    .then(({ SplashScreen }) => SplashScreen.hide({ fadeOutDuration: 200 }))
    .catch(() => {});
}

/**
 * Dismiss the launch splash once the first screen has actually been painted.
 *
 * Two animation frames are awaited deliberately: the first fires before the
 * browser paints, the second after — so the splash hands off to real content
 * instead of the blank frame that made a flash visible before.
 *
 * Safe to call on web — it no-ops.
 */
export function hideSplashWhenReady() {
  if (typeof window === "undefined") return;
  if (!Capacitor.isNativePlatform()) return;

  // Failsafe: never leave the splash up, even if rendering stalls.
  window.setTimeout(hideSplash, SPLASH_FAILSAFE_MS);

  requestAnimationFrame(() => requestAnimationFrame(hideSplash));
}

/**
 * Initialize native-only behavior when running inside Capacitor.
 * Safe to call on web — it no-ops.
 */
export function initNative() {
  if (typeof window === "undefined") return;
  if (!Capacitor.isNativePlatform()) return;

  // Status bar styling.
  void import("@capacitor/status-bar")
    .then(({ StatusBar, Style }) => {
      void StatusBar.setStyle({ style: Style.Dark });
      void StatusBar.setBackgroundColor({ color: "#0b1f3a" }).catch(() => {});
    })
    .catch(() => {});

  // Intercept external link clicks so they open in the in-app browser
  // instead of replacing the webview (which would strand the user
  // outside the app with no back button).
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const anchor = target.closest("a") as HTMLAnchorElement | null;
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href) return;

    // Allow tel:, mailto:, sms:, and same-origin links to behave normally.
    if (/^(tel:|mailto:|sms:|geo:|maps:)/i.test(href)) return;
    const isExternal = /^https?:\/\//i.test(href) && !href.startsWith(window.location.origin);
    if (!isExternal) return;

    event.preventDefault();
    void import("@capacitor/browser")
      .then(({ Browser }) => Browser.open({ url: href, presentationStyle: "popover" }))
      .catch(() => {
        window.open(href, "_blank");
      });
  });
}