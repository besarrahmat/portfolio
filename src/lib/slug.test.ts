import { describe, expect, it } from "vitest";
import { slugify, uniqueSlug } from "./slug";

describe("slugify", () => {
  it("lowercases, strips accents and collapses separators", () => {
    expect(slugify("  NIKKE Progression -- Calculator! ")).toBe(
      "nikke-progression-calculator",
    );
    expect(slugify("Café Déjà vu")).toBe("cafe-deja-vu");
  });
});

describe("uniqueSlug", () => {
  it("appends -2, -3 when the slug is taken", () => {
    expect(uniqueSlug("Timetables", new Set())).toBe("timetables");
    expect(uniqueSlug("Timetables", new Set(["timetables"]))).toBe(
      "timetables-2",
    );
    expect(
      uniqueSlug("Timetables", new Set(["timetables", "timetables-2"])),
    ).toBe("timetables-3");
  });

  it("falls back to a short random slug when the title has no Latin letters", () => {
    const slug = uniqueSlug("時間割", new Set());
    expect(slug).toMatch(/^[0-9a-f]{8}$/);
  });
});
