import { readFileSync } from "node:fs";
import { expect, type Page, test } from "@playwright/test";

// Overview + /cv (docs/PLAN.md Fase 7). The CV-missing path lives in cv-missing.spec.ts (it edits local D1).
const desktop = { width: 1440, height: 900 };
const phone = { width: 390, height: 844 };
const FILENAME = "Besar-Rachmat-Ikhsan-Pambudi-CV.pdf";

const card = (page: Page) => page.locator(".meishi");
for (const [label, viewport] of [
  ["desktop", desktop],
  ["phone", phone],
] as const)
  test(`${label}: arrive → Download CV on the card → the real PDF (one step)`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const cv = card(page).getByRole("link", { name: /Download CV/ });
    await expect(cv).toBeInViewport();
    const download = page.waitForEvent("download");
    await cv.click();
    const file = await download;
    expect(file.suggestedFilename()).toBe(FILENAME);
    expect(readFileSync(await file.path())).toEqual(
      readFileSync("content/media/cv.pdf"),
    );
  });

test("/cv answers the latest PDF as an attachment", async ({ request }) => {
  const res = await request.get("/cv");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toBe("application/pdf");
  expect(res.headers()["content-disposition"]).toBe(
    `attachment; filename="${FILENAME}"`,
  );
  expect(res.headers()["cache-control"]).toBe("no-cache");
  expect(res.headers().etag).toBeTruthy();
});

test("phone: the CV dock stays out of the way until the card leaves the screen", async ({
  page,
}) => {
  await page.setViewportSize(phone);
  await page.goto("/");
  const dock = page
    .getByRole("banner")
    .getByRole("link", { name: /Download CV/ });
  await expect(dock).toBeHidden();
  await page
    .getByRole("heading", { name: "Activity log" })
    .scrollIntoViewIfNeeded();
  await expect(dock).toBeVisible();
});

test("turning the card shows what serves it, keeps Download CV, and moves focus", async ({
  page,
}) => {
  await page.setViewportSize(desktop);
  await page.goto("/");
  // The label says what the next press does (no aria-pressed on top of it).
  const turn = page.locator(".meishi__turn");
  await expect(turn).toHaveText(/^Turn the card over/);
  await turn.click();
  await expect(turn).toHaveText("Turn the card back");
  const back = page.getByRole("heading", { name: "This card is served by" });
  await expect(back).toBeFocused();
  await expect(
    card(page).getByRole("link", { name: /Download CV/ }),
  ).toHaveCount(1);
  await expect(
    card(page).getByRole("link", { name: "How it's built" }),
  ).toBeVisible();
  // The back is the portfolio record's own diagram (one source), set compact.
  const diagram = card(page).locator(".pd-diagram--compact");
  await expect(diagram).toContainText("Cloudflare D1");
  await expect(diagram.locator(".pd-link li").first()).toContainText("HTTPS");
  // The phrase in the one-liner is the second way in; turning back lands on the name.
  await turn.click();
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await page.getByRole("button", { name: "architecture diagram" }).click();
  await expect(back).toBeFocused();
});

test("ledger, featured records and activity come from D1", async ({ page }) => {
  await page.goto("/");
  const ledger = page.locator(".ov-ledger");
  await expect(ledger).toContainText(/\d+ yrs?( \d+ mo)?/);
  await expect(ledger).toContainText("live systems");
  await expect(ledger).toContainText("v1.0.1");
  const table = page.getByRole("region", { name: "On the table" });
  await expect(table.getByRole("link")).not.toHaveCount(0);
  await expect(table.getByRole("listitem").first()).toContainText("No. 001");
  // The link's accessible name is the record's title, not the whole card (screen readers).
  await expect(
    table.getByRole("link", { name: "SOBAT-PS", exact: true }),
  ).toBeVisible();
  // Live systems first, then this site itself (critique, Fase 7).
  await expect(table.locator(".ui-card__title")).toHaveText([
    "SOBAT-PS",
    "PolicySemVer",
    "This portfolio",
  ]);
  // Outcomes only: roles joined and projects delivered, never "Started …".
  const log = page.locator(".ov-log li");
  await expect(log).toHaveCount(5);
  for (const text of await log.allInnerTexts())
    expect(text).toMatch(/Joined|Delivered/);
});

test("head carries the static OG image and Person JSON-LD without an email", async ({
  request,
}) => {
  const html = await (await request.get("/")).text();
  expect(html).toMatch(
    /<meta property="og:image" content="[^"]*opengraph-image\.png/,
  );
  const ld = html.match(/<script type="application\/ld\+json">([^<]*)/)?.[1];
  const data = JSON.parse(ld ?? "null");
  expect(data["@type"]).toBe("ProfilePage");
  expect(data.mainEntity).toMatchObject({
    "@type": "Person",
    alternateName: ["Besar Rahmat"],
  });
  expect(ld).not.toMatch(/email|@[a-z0-9-]+\./i);
});
