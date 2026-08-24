import documents from "@/content/documents.json";
import bundled from "@/content/bundled-documents.json";

/**
 * Resolve a document (PDF, flyer, or slide) to something the UI can link to.
 *
 * Two kinds of document exist:
 *
 * 1. **Bundled** — the file ships inside the app (`public/documents/`) and is
 *    listed in `bundled-documents.json`. These open in the in-app viewer and
 *    work with no signal at all, which is the point: someone who has just
 *    arrived at Aviano may have no Italian SIM and no wifi, and PCS paperwork
 *    is exactly what they need. Bundled always wins for that reason.
 * 2. **Linked** — published on a website and listed in `documents.json`.
 *    Used for anything not bundled. Needs internet.
 *
 * Returns `undefined` when a document is neither bundled nor published yet,
 * which makes the pages show their "Coming soon" state instead of a dead link.
 */
export function resolveDocument(filename: string): string | undefined {
  const slug = (bundled as Record<string, string>)[filename];
  if (slug) return `${IN_APP_PREFIX}${encodeURIComponent(slug)}`;

  const url = (documents as Record<string, string>)[filename];
  return url && url.trim() ? url.trim() : undefined;
}

const IN_APP_PREFIX = "/document?doc=";

/**
 * True when resolveDocument returned an in-app viewer route rather than an
 * external website. Callers use this to pick a router <Link> (stays inside the
 * app) over an <a target="_blank"> (leaves for the in-app browser).
 */
export function isInAppDocument(href: string): boolean {
  return href.startsWith(IN_APP_PREFIX);
}

/** The bundled file's URL, e.g. for the viewer to fetch. */
export function documentFileUrl(slug: string): string {
  return `/documents/${slug}`;
}
