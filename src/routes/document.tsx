import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, FileText, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { documentFileUrl } from "@/lib/documents";

export const Route = createFileRoute("/document")({
  head: () => ({ meta: [{ title: "Document — Aviano AB" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    doc: typeof search.doc === "string" ? search.doc : "",
    // The linking page knows the human name ("General Pharmacy Information");
    // without it the header can only show the filename.
    title: typeof search.title === "string" ? search.title : undefined,
  }),
  component: DocumentPage,
});

/**
 * Renders a bundled PDF with pdf.js.
 *
 * Why not just link to the file? Android's WebView has no PDF renderer, so a
 * plain link to a bundled PDF opens a blank screen. Rendering to canvas
 * ourselves behaves identically on both platforms and needs no PDF app
 * installed on the device — which matters, because the whole reason these are
 * bundled is to work with no connectivity.
 */
function DocumentPage() {
  const { doc, title: passedTitle } = Route.useSearch();
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [pageCount, setPageCount] = useState(0);

  const title =
    passedTitle ??
    (doc
      ? decodeURIComponent(doc)
          .replace(/-/g, " ")
          .replace(/\.(pdf|jpe?g|png)$/i, "")
      : "Document");
  const isImage = /\.(jpe?g|png|gif|webp)$/i.test(doc ? decodeURIComponent(doc) : "");

  useEffect(() => {
    if (!doc) {
      setStatus("error");
      return;
    }
    let cancelled = false;
    let observer: IntersectionObserver | undefined;
    const canvases: HTMLCanvasElement[] = [];

    // A third of these documents are flyers and slides, not PDFs. Those just
    // need an <img> — running them through pdf.js would only fail.
    const name = decodeURIComponent(doc);
    if (/\.(jpe?g|png|gif|webp)$/i.test(name)) {
      const container = containerRef.current;
      if (!container) return;
      container.replaceChildren();
      const img = new Image();
      img.src = documentFileUrl(name);
      img.alt = title;
      img.className = "w-full h-auto rounded-lg border border-border bg-white shadow-sm";
      img.onload = () => {
        if (cancelled) return;
        container.appendChild(img);
        setPageCount(1);
        setStatus("ready");
      };
      img.onerror = () => !cancelled && setStatus("error");
      return () => {
        cancelled = true;
      };
    }

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        // The worker must be bundled too — a CDN URL would break offline.
        const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

        const pdf = await pdfjs.getDocument({ url: documentFileUrl(decodeURIComponent(doc)) })
          .promise;
        if (cancelled) return;
        setPageCount(pdf.numPages);

        const container = containerRef.current;
        if (!container) return;
        container.replaceChildren();

        const width = Math.min(container.clientWidth, 1400);
        // Cap the pixel ratio: a phone at 3x on a 20-page document would hold a
        // lot of bitmap for no visible gain.
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

        // Lay out correctly-sized placeholders first, then paint each page only
        // as it nears the viewport. Rendering all pages up front is what makes
        // long PDFs stall on a phone.
        const pending = new Map<HTMLCanvasElement, number>();
        for (let n = 1; n <= pdf.numPages; n++) {
          if (cancelled) return;
          const page = await pdf.getPage(n);
          const base = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: (width / base.width) * dpr });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = "w-full h-auto rounded-lg border border-border bg-white shadow-sm";
          container.appendChild(canvas);
          canvases.push(canvas);
          pending.set(canvas, n);
        }
        if (!cancelled) setStatus("ready");

        const paint = async (canvas: HTMLCanvasElement) => {
          const n = pending.get(canvas);
          if (n === undefined) return;
          pending.delete(canvas); // paint once
          const page = await pdf.getPage(n);
          const base = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: (width / base.width) * dpr });
          // v6: pass `canvas`, not `canvasContext` — supplying both hangs the
          // render task.
          await page.render({ canvas, viewport }).promise;
        };

        // Paint the opening pages immediately so something is on screen right
        // away, and let the rest fill in as they approach the viewport. Each
        // page is painted independently — a slow page must not block the
        // others, which is what a sequential await chain would do.
        const EAGER_PAGES = 2;
        for (const c of canvases.slice(0, EAGER_PAGES)) void paint(c);

        const io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                void paint(e.target as HTMLCanvasElement);
                io.unobserve(e.target);
              }
            }
          },
          { rootMargin: "800px 0px" },
        );
        for (const c of canvases.slice(EAGER_PAGES)) io.observe(c);
        observer = io;
      } catch (err) {
        console.error("[document] failed to render", err);
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      observer?.disconnect();
      // Free the canvas memory rather than leaving it to the GC — long PDFs
      // can hold a lot of bitmap.
      for (const c of canvases) {
        c.width = 0;
        c.height = 0;
      }
    };
  }, [doc]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3">
        <Button asChild size="icon" variant="ghost" className="text-primary-foreground shrink-0">
          <Link to="/lrs" aria-label="Back">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div className="min-w-0">
          <p className="font-semibold leading-tight truncate capitalize">{title}</p>
          {status === "ready" && pageCount > 0 && (
            <p className="text-xs opacity-80">
              {isImage ? "Saved in the app" : `${pageCount} page${pageCount === 1 ? "" : "s"} · saved in the app`}
            </p>
          )}
        </div>
      </header>

      {status === "loading" && (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
          <p className="text-sm">Opening document…</p>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center gap-3 py-24 px-6 text-center">
          <AlertCircle className="size-8 text-amber-500" />
          <p className="font-medium">This document couldn't be opened</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            It may not have been included in this version of the app. Try updating the app from the
            store.
          </p>
          <Button asChild variant="outline" className="mt-2">
            <Link to="/">
              <FileText className="size-4" /> Back to the app
            </Link>
          </Button>
        </div>
      )}

      <div ref={containerRef} className="px-3 py-3 space-y-3" />
    </div>
  );
}
