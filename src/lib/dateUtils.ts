/**
 * Date helpers. Everything here operates on "YYYY-MM-DD" strings directly.
 *
 * We deliberately avoid `Date` objects for comparisons/arithmetic on the
 * reservation model itself, because JS Date + timezones is a classic source
 * of off-by-one-day bugs, and it's completely unnecessary here: two ISO date
 * strings of the form YYYY-MM-DD compare correctly with plain `<`, `<=`, etc.
 * (lexicographic order == chronological order for a fixed-width, zero-padded
 * format). `Date` objects are only used at the very edge, for calendar-grid
 * rendering (e.g. "what are the 7 days in this week").
 */

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

/** Inclusive range overlap check on "YYYY-MM-DD" strings. */
export function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

export function toDateObj(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const dt = toDateObj(iso);
  dt.setUTCDate(dt.getUTCDate() + days);
  return toIso(dt);
}

export function todayIso(): string {
  return toIso(new Date());
}

/** Number of calendar days spanned by an inclusive range (1 = single day). */
export function rangeLengthDays(startIso: string, endIso: string): number {
  const ms = toDateObj(endIso).getTime() - toDateObj(startIso).getTime();
  return Math.round(ms / 86_400_000) + 1;
}

export function formatDisplayDate(iso: string): string {
  const dt = toDateObj(iso);
  return dt.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDisplayRange(startIso: string, endIso: string): string {
  if (startIso === endIso) return formatDisplayDate(startIso);
  return `${formatDisplayDate(startIso)} \u2013 ${formatDisplayDate(endIso)}`;
}

/** All ISO dates from start to end, inclusive. */
export function eachDateInRange(startIso: string, endIso: string): string[] {
  const days: string[] = [];
  let cur = startIso;
  let guard = 0;
  while (cur <= endIso && guard < 10_000) {
    days.push(cur);
    cur = addDays(cur, 1);
    guard += 1;
  }
  return days;
}

export function startOfWeek(iso: string): string {
  const dt = toDateObj(iso);
  const day = dt.getUTCDay(); // 0 = Sunday
  dt.setUTCDate(dt.getUTCDate() - day);
  return toIso(dt);
}

export function startOfMonth(iso: string): string {
  const [y, m] = iso.split("-");
  return `${y}-${m}-01`;
}

export function addMonths(iso: string, months: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1 + months, 1));
  const lastDay = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth() + 1, 0)).getUTCDate();
  dt.setUTCDate(Math.min(d, lastDay));
  return toIso(dt);
}

export function weekdayLabel(iso: string): string {
  const dt = toDateObj(iso);
  return dt.toLocaleDateString("en-US", { timeZone: "UTC", weekday: "short" });
}

export function monthLabel(iso: string): string {
  const dt = toDateObj(iso);
  return dt.toLocaleDateString("en-US", { timeZone: "UTC", month: "long", year: "numeric" });
}
