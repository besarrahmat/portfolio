// Months are "YYYY-MM"; an interval covers its start and end months inclusively, end null = present.
export type MonthRange = { start: string; end: string | null };

const toIndex = (month: string) => {
  const [y, m] = month.split("-").map(Number);
  return y * 12 + (m - 1);
};

// Merges overlapping or back-to-back ranges; a gap of one month or more stays a gap.
export function mergeIntervals(ranges: MonthRange[], now: string) {
  const sorted = ranges
    .map((r) => [toIndex(r.start), toIndex(r.end ?? now)] as const)
    .sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const [start, end] of sorted) {
    const last = merged.at(-1);
    if (last && start <= last[1] + 1) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  }
  return merged;
}

export const experienceMonths = (ranges: MonthRange[], now: string) =>
  mergeIntervals(ranges, now).reduce((sum, [s, e]) => sum + e - s + 1, 0);
