import { experienceMonths } from "./experience";

// "YYYY-MM" for a date in Rahmat's time zone, so "Present" and expiry flip at his midnight, not UTC's.
export const currentMonth = (date: Date) =>
  date.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" }).slice(0, 7);

// 54 → "4 yrs 6 mo"; the ledger, the timeline and the CV all use this one wording.
export function formatDuration(months: number) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [y && `${y} ${y === 1 ? "yr" : "yrs"}`, (m || !y) && `${m} mo`];
  return parts.filter(Boolean).join(" ");
}

// Inclusive length of one role, end null = still there.
export const spanMonths = (start: string, end: string | null, now: string) =>
  experienceMonths([{ start, end }], now);

// A certificate is valid through its expiry month and expired from the month after.
export function certificateStatus(expiresAt: string | null, now: string) {
  if (!expiresAt) return "no-expiry" as const;
  return now > expiresAt ? ("expired" as const) : ("valid" as const);
}
