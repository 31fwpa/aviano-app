import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Home, BookUser, Calendar as CalendarIcon, Siren } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { Toaster } from "@/components/ui/sonner";
import { triggerHaptic } from "@/lib/haptic";
import { initNative, hideSplashWhenReady } from "@/lib/native";
import { initNativePush } from "@/lib/push";
import { useEffect } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0b1f3a" },
      { title: "Aviano Air Base" },
      { name: "description", content: "Directory, calendar, and emergency info for Aviano Air Base." },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Aviano AB" },
      { property: "og:title", content: "Aviano Air Base" },
      { property: "og:description", content: "Directory, calendar, and emergency info for Aviano Air Base." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Aviano Air Base" },
      { name: "twitter:description", content: "Directory, calendar, and emergency info for Aviano Air Base." },
      // Social preview images point at the app's own bundled icon. They used
      // to reference a screenshot on Lovable's CDN — a third-party URL we
      // don't control, which would rot and looks wrong in a store submission.
      { property: "og:image", content: "/icon-512.png" },
      { name: "twitter:image", content: "/icon-512.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/icon-192.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    initNative();
    hideSplashWhenReady();

    // Native apps (iOS/Android): register for push via FCM/APNs and store
    // the device token. Browsers: keep the old web-push service worker.
    if (Capacitor.isNativePlatform()) {
      initNativePush((link) => router.history.push(link));
    } else if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const host = window.location.hostname;
      const isPreview = host.includes("id-preview--") || host.includes("lovableproject.com");
      const inIframe = (() => { try { return window.self !== window.top; } catch { return true; } })();
      if (!isPreview && !inIframe) {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      }
    }
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
      <Toaster />
    </QueryClientProvider>
  );
}

function AppShell() {
  return (
    // Bottom padding must reserve the floating nav's real height: the pill
    // (~5rem) PLUS the 16px gap and the device's safe-area inset that the nav
    // adds below it — otherwise the last rows of content hide behind it.
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

function BottomNav() {
  const items = [
    { to: "/", label: "Home", Icon: Home },
    { to: "/directory", label: "Directory", Icon: BookUser },
    { to: "/calendar", label: "Calendar", Icon: CalendarIcon },
    { to: "/emergency", label: "Emergency", Icon: Siren, danger: true },
  ];
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 flex justify-center px-4"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
    >
      <div className="w-full max-w-sm bg-card/80 backdrop-blur-2xl border border-border/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[32px] px-2 py-2 flex items-center justify-between">
        {items.map(({ to, label, Icon, danger }) => (
          <Link
            key={to}
            to={to}
            onClick={() => triggerHaptic(10)}
            className="relative flex flex-col items-center justify-center w-1/4 py-2 rounded-[24px] text-muted-foreground transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            activeProps={{
              className: danger
                ? "bg-destructive text-white shadow-md shadow-destructive/20"
                : "bg-primary text-white shadow-md shadow-primary/20",
            }}
            activeOptions={{ exact: to === "/" }}
          >
            <Icon className="size-5 mb-0.5" />
            <span className="text-[10px] font-semibold">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
