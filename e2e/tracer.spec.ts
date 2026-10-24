import { expect, test } from "@playwright/test";

test("health answers as this project", async ({ request }) => {
  const res = await request.get("/api/v1/health");
  expect(res.ok()).toBe(true);
  expect(await res.json()).toMatchObject({ service: "portfolio", ok: true });
});

test("home renders the D1-backed note", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("health-note")).toBeVisible();
});

test("unknown public path is a real 404", async ({ request }) => {
  expect((await request.get("/not-a-page")).status()).toBe(404);
});

// cacheComponents streams the shell before notFound() runs, so under /m/ a miss is a soft 404 (200 + noindex).
test("unknown manage path leaks nothing", async ({ request }) => {
  const res = await request.get("/m/not-the-manage-path");
  const body = await res.text();
  expect(body).not.toContain("Manage tracer");
  expect(body).toContain('<meta name="robots" content="noindex"/>');
  expect(res.headers()["cache-control"]).toContain("no-store");
});

test("touch via manage path → home shows fresh data (updateTag)", async ({
  page,
}) => {
  const managePath = process.env.E2E_MANAGE_PATH;
  test.skip(!managePath, "set E2E_MANAGE_PATH to the MANAGE_PATH secret");
  await page.goto("/");
  const before = await page.getByTestId("health-note").textContent();
  await page.goto(`/m/${managePath}`);
  await page.getByRole("button", { name: "Touch health row" }).click();
  await expect(page.getByText(/Current note: touched/)).toBeVisible();
  await page.goto("/");
  await expect(page.getByTestId("health-note")).not.toHaveText(before ?? "");
  await expect(page.getByTestId("health-note")).toContainText("touched");
});
