// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  // Dev-server only: the 31 FSS iCal feed sends no CORS headers, so a browser
  // cannot fetch it directly. The native apps use CapacitorHttp instead (see
  // src/lib/events.ts) — this proxy exists purely so `npm run dev` can show
  // real events. It has no effect on the production build.
  vite: {
    server: {
      proxy: {
        "/fss-events.ics": {
          target: "https://31fss.com",
          changeOrigin: true,
          rewrite: () => "/?post_type=tribe_events&ical=1&eventDisplay=list",
        },
      },
    },
  },
  tanstackStart: {
    server: { entry: "server" },
    // SPA mode: pre-render a static index.html shell at build time so the
    // app can be bundled offline inside the Capacitor native wrapper.
    spa: {
      enabled: true,
      prerender: { outputPath: "/index.html" },
    },
  },
});
