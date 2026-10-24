import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const dir = join(__dirname, "../../content/seed");
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
const text = files.map((f) => readFileSync(join(dir, f), "utf8")).join("\n");

// sha256 prefixes of hidden names (NDA client/project names, private people, hidden schools), so the list itself leaks nothing.
const DENYLIST = new Set([
  "7ec6a48ef34f6f21",
  "57c800fb28e96ad6",
  "c2be22826db89658",
  "101ed0cd7c27b412",
  "86e3f0c2e5967e3d",
  "b0a1f37077f9e547",
  "6a621ec588c0d800",
  "8518014a120ae9ed",
  "022493e3b2641a6a",
  "f6d8f0dac4a886d9",
  "4c30dbf0a16dcb46",
]);
const hash = (w: string) =>
  createHash("sha256").update(w).digest("hex").slice(0, 16);

describe("content seed", () => {
  it("has seed files", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it("contains no email address", () => {
    expect(text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g)).toBeNull();
  });

  it("contains no phone number", () => {
    expect(text.match(/(\+62|\b0)8[\d\s-]{7,}\d/g)).toBeNull();
  });

  it("contains no denylisted name", () => {
    const hits = text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => DENYLIST.has(hash(w)));
    expect(hits).toEqual([]);
  });

  it("gives private links no url", () => {
    const projects = JSON.parse(
      readFileSync(join(dir, "projects.json"), "utf8"),
    );
    const leaked = projects.flatMap(
      (p: { links: { visibility: string; url?: string }[] }) =>
        p.links.filter((l) => l.visibility === "private" && l.url),
    );
    expect(leaked).toEqual([]);
  });
});
