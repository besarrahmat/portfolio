import { execFileSync } from "node:child_process";
import { expect, test } from "@playwright/test";

// /cv with no file (docs/PLAN.md Fase 7 🔴). Runs as its own Playwright project after every other spec,
// because it empties profile.cv_key in the shared local D1 and restores it afterwards.
const CV_KEY = "cv/Besar-Rachmat-Ikhsan-Pambudi-CV.pdf";
const setCvKey = (value: string | null) =>
  execFileSync(
    "npx",
    [
      "wrangler",
      "d1",
      "execute",
      "DB",
      "--local",
      "--command",
      `UPDATE profile SET cv_key = ${value ? `'${value}'` : "NULL"} WHERE id = 1`,
    ],
    { stdio: "ignore" },
  );

test.describe.configure({ mode: "serial" });
test.skip(
  Boolean(process.env.BASE_URL),
  "edits local D1; never run against a deployed Worker",
);

test.describe("CV missing from storage", () => {
  test.beforeAll(() => setCvKey(null));
  test.afterAll(() => setCvKey(CV_KEY));

  test("/cv lands on a friendly page with LinkedIn, and the card offers LinkedIn", async ({
    page,
  }) => {
    await page.goto("/cv");
    await expect(page).toHaveURL(/\/cv\/unavailable$/);
    await expect(
      page.getByRole("heading", { name: "The CV is not available right now" }),
    ).toBeVisible();
    await expect(
      page.getByRole("main").getByRole("link", { name: /LinkedIn/ }),
    ).toBeVisible();

    await page.goto("/");
    await expect(
      page.locator(".meishi").getByRole("link", { name: /Download CV/ }),
    ).toHaveCount(0);
    await expect(
      page.locator(".meishi").getByRole("link", { name: "View on LinkedIn" }),
    ).toBeVisible();
  });

  test("the dock's download fails over to LinkedIn instead of saving HTML", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/components"); // any page other than Overview shows the topbar CV
    await page
      .getByRole("banner")
      .getByRole("link", { name: /Download CV/ })
      .click();
    await expect(page.getByRole("banner").getByRole("alert")).toContainText(
      "The download failed",
    );
  });
});

test.describe("CV key set but the file is gone from R2", () => {
  test.beforeAll(() => setCvKey("cv/missing.pdf"));
  test.afterAll(() => setCvKey(CV_KEY));

  test("plain CV links open the friendly page instead of saving it as the PDF", async ({
    page,
  }) => {
    await page.goto("/contact");
    await page
      .getByRole("main")
      .getByRole("link", { name: /CV\.pdf/ })
      .click();
    await expect(page).toHaveURL(/\/cv\/unavailable$/);
    await expect(
      page.getByRole("heading", { name: "The CV is not available right now" }),
    ).toBeVisible();
  });
});
