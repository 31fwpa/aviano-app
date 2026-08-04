import { Capacitor } from "@capacitor/core";

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