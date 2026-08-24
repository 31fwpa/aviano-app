import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, FileText, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { documentFileUrl } from "@/lib/documents";

export const Route = createFileRoute("/document")({
  head: () => ({ meta: [{ title: "Document — Aviano AB" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    doc: typeof search.doc === "string" ? search.doc : "",
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
  const { doc } = Route.useSearch();
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [pageCount, setPageCount] = useState(0);

  const title = doc ? decodeURIComponent(doc).replace(/-/g, " ").replace(/\.pdf$/i, "") : "Document";

  useEffect(() => {
    if (!doc) {
      setStatus("error");
      return;
    }
    let cancelled = false;
    const canvases: HTMLCanvasElement[] = [];

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        // The worker must be bundled too — a CDN URL would break offline.
        const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

        const pdf = await pdfjs.getDocument(documentFileUrl(decodeURIComponent(doc))).promise;
        if (cancelled) return;
        setPageCount(pdf.numPages);

        const container = containerRef.current;
        if (!container) return;
        container.replaceChildren();

        // Render at the container's width, capped for memory on long documents.
        const width = Math.min(container.clientWidth, 1400);
        for (let n = 1; n <= pdf.numPages; n++) {
          if (cancelled) return;
          const page = await pdf.getPage(n);
          const base = page.getViewport({ scale: 1 });
          const scale = (width / base.width) * Math.min(window.devicePixelRatio || 1, 2);
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = "w-full h-auto rounded-lg border border-border bg-white shadow-sm";
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          container.appendChild(canvas);
          canvases.push(canvas);
          await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        }
        if (!cancelled) setStatus("ready");
      } catch (err) {
        console.error("[document] failed to render", err);
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
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
              {pageCount} page{pageCount === 1 ? "" : "s"} · saved in the app
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
