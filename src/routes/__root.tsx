import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Home, BookUser, Calendar as CalendarIcon, Siren } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    // Register service worker for push notifications (production only)
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const host = window.location.hostname;
      const isPreview = host.includes("id-preview--") || host.includes("lovableproject.com");
      const inIframe = (() => { try { return window.self !== window.top; } catch { return true; } })();
      if (!isPreview && !inIframe) {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      }
    }
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
      <Toaster />
    </QueryClientProvider>
  );
}

function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-20">
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
      className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4 max-w-xl mx-auto">
        {items.map(({ to, label, Icon, danger }) => (
          <li key={to} className="px-1">
            <Link
              to={to}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2.5 text-xs rounded-lg transition-colors",
                "text-muted-foreground",
                danger
                  ? "data-[status=active]:bg-destructive data-[status=active]:text-white"
                  : "data-[status=active]:bg-primary data-[status=active]:text-white",
                "data-[status=active]:shadow"
              )}
              activeOptions={{ exact: to === "/" }}
            >
              <Icon className="size-5" />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
