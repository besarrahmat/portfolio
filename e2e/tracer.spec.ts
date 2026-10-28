import { expect, test } from "@playwright/test";

test("health answers as this project", async ({ request }) => {
  const res = await request.get("/api/v1/health");
  expect(res.ok()).toBe(true);
  expect(await res.json()).toMatchObject({ service: "portfolio", ok: true });
});

test("home renders the profile from D1", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Besar Rachmat Ikhsan Pambudi",
    }),
  ).toBeVisible();
});

test("unknown public path is a real 404", async ({ request }) => {
  expect((await request.get("/not-a-page")).status()).toBe(404);
});
