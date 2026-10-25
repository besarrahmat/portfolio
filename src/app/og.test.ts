import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";

// Fase 7 🔴: OG images are static files only; a generated one would burn Worker CPU on every share.
test("no route generates an OG or Twitter image at request time", () => {
  const app = fileURLToPath(new URL(".", import.meta.url));
  const files = readdirSync(app, { recursive: true, encoding: "utf8" });
  expect(
    files.filter((f) => /(opengraph|twitter)-image\.(js|jsx|ts|tsx)$/.test(f)),
  ).toEqual([]);
  expect(files).toContain("opengraph-image.png");
});
