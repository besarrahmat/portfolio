import { execFileSync } from "node:child_process";
import { expect, test } from "@playwright/test";

// Fase 7 🔴: the email alias is never whole in any HTML or RSC payload, only assembled on click.
// Runs in the local-d1-email project (playwright.config.ts): it sets a test alias in local D1 and clears it after.
const ALIAS = "portfolio.test@example.com";
const setAlias = (value: string | null) =>
  execFileSync(
    "npx",
    [
      "wrangler",
      "d1",
      "execute",
      "DB",
      "--local",
      "--command",
      `UPDATE profile SET contact_email = ${value ? `'${value}'` : "NULL"} WHERE id = 1`,
    ],
    { stdio: "ignore" },
  );

const PAGES = [
  "/",
  "/projects",
  "/projects/sobat-ps",
  "/experience",
  "/skills",
  "/education",
  "/contact",
  "/components",
  "/cv/unavailable",
];

test.describe.configure({ mode: "serial" });
test.skip(
  Boolean(process.env.BASE_URL),
  "edits local D1; never run against a deployed Worker",
);
test.beforeAll(() => setAlias(ALIAS));
test.afterAll(() => setAlias(null));

test("no page sends the alias whole, in HTML or in the RSC payload", async ({
  request,
}) => {
  const [local, domain] = ALIAS.split("@");
  for (const path of PAGES)
    for (const headers of [{}, { RSC: "1" }] as Record<string, string>[]) {
      const body = await (await request.get(path, { headers })).text();
      const where = `${path} ${"RSC" in headers ? "RSC" : "HTML"}`;
      expect(body.length, where).toBeGreaterThan(0);
      expect(body, where).not.toContain(ALIAS);
      expect(body, where).not.toContain(`${local}@`);
      expect(body, where).not.toContain(`@${domain}`);
      expect(body, where).not.toContain("mailto:");
    }
});

test("Show email assembles the address, focuses it, and Copy copies it", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/contact");
  await page.getByRole("button", { name: "Show email" }).click();
  const address = page.getByRole("link", { name: ALIAS });
  await expect(address).toBeFocused();
  await expect(address).toHaveAttribute("href", `mailto:${ALIAS}`);
  await page.getByRole("button", { name: "Copy" }).click();
  await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(ALIAS);
});
