import documents from "@/content/documents.json";

/**
 * Resolve a document (PDF, flyer, or slide) filename to its published URL.
 *
 * These files are NOT bundled in the app — they are published on the base
 * website, and `src/content/documents.json` maps each filename to its web
 * address. Adding a document is therefore a content edit, not a code change:
 * upload the file, then paste its URL next to the filename in that JSON file.
 * See CONTENT_EDITING_GUIDE.md.
 *
 * Returns `undefined` while a document has no URL yet, which makes the LRS and
 * Medical Group pages show their built-in "Coming soon" / "not yet available"
 * state instead of a dead link.
 */
export function resolveDocument(filename: string): string | undefined {
  const url = (documents as Record<string, string>)[filename];
  return url && url.trim() ? url : undefined;
}
