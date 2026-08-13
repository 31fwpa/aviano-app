/**
 * Directory phone fields carry their own labels, and often several numbers in
 * one string:
 *
 *   "Main: 0434304878"
 *   "Main: +390434305321, Work: +390434306247"
 *   "0434-30-7480"
 *
 * Feeding that straight into a `tel:` link makes the phone app try to dial
 * "Main: 0434304878" — label and all — and when there are several numbers,
 * only one link exists for all of them. Split the field into individually
 * callable entries instead.
 */
export type PhoneEntry = {
  /** "Main", "Work", "DSN"… or null when the field had no label. */
  label: string | null;
  /** What the user reads, e.g. "+390434305321". */
  display: string;
  /** What the dialer receives: digits, with an optional leading "+". */
  dial: string;
};

/**
 * Reduce a written number to something a dialer will accept. Spaces, dashes,
 * parentheses and dots are decoration; a leading "+" is meaningful (it makes
 * the international prefix work from any country) so it is preserved.
 */
export function toDialable(phone: string): string {
  const trimmed = phone.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return plus + trimmed.replace(/\D/g, "");
}

export function parsePhones(raw: string | null | undefined): PhoneEntry[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      // "Main: 0434304878" -> label "Main", number "0434304878"
      const match = part.match(/^([^:]+):\s*(.+)$/);
      const label = match ? match[1].trim() : null;
      const display = (match ? match[2] : part).trim();
      return { label, display, dial: toDialable(display) };
    })
    .filter((entry) => entry.dial.replace("+", "").length > 0);
}
