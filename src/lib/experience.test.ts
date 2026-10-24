import { describe, expect, it } from "vitest";
import experiences from "../../content/seed/experiences.json";
import { experienceMonths, mergeIntervals } from "./experience";

const counted = experiences.filter((e) => e.counts_toward_experience);

describe("mergeIntervals", () => {
  it("merges the overlapping 2022-2023 contracts and keeps the Nov 2023 gap", () => {
    expect(mergeIntervals(counted, "2026-10")).toEqual([
      [2022 * 12 + 3, 2023 * 12 + 9], // 2022-04 .. 2023-10
      [2023 * 12 + 11, 2026 * 12 + 9], // 2023-12 .. 2026-10 (MINORI -> GCT share Jan 2026)
    ]);
  });

  it("counts 54 months as of October 2026", () => {
    expect(experienceMonths(counted, "2026-10")).toBe(19 + 35);
  });

  it("joins back-to-back months and handles an empty list", () => {
    const back = [
      { start: "2024-01", end: "2024-03" },
      { start: "2024-04", end: null },
    ];
    expect(experienceMonths(back, "2024-06")).toBe(6);
    expect(experienceMonths([], "2024-06")).toBe(0);
  });
});
