import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import certifications from "../content/seed/certifications.json";
import experiences from "../content/seed/experiences.json";
import skills from "../content/seed/skills.json";

// Experience, Skills, Education, Contact (docs/PLAN.md Fase 7).
const month = () =>
  new Date()
    .toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" })
    .slice(0, 7);

test("Experience: every published role, newest first, with exact months", async ({
  page,
}) => {
  const published = experiences.filter((e) => e.status === "published");
  await page.goto("/experience");
  const roles = page.locator(".ui-timeline > li");
  await expect(roles).toHaveCount(published.length);
  await expect(roles.first()).toContainText(published[0].start);
  await expect(roles.first()).toContainText("Present");
  await expect(roles.first()).toContainText("No. 001");
  await expect(page.locator(".pg-intro")).toContainText(/\d+ yrs?/);
  await page.getByRole("link", { name: "SOBAT-PS" }).click();
  await expect(page).toHaveURL(/\/projects\/sobat-ps$/);
});

test("Skills: main stack first, every row reachable by id, counts open the projects", async ({
  page,
}) => {
  await page.goto("/skills");
  const main = page.getByRole("region", { name: "Main stack" });
  await expect(main.locator("li")).toHaveCount(
    skills.filter((s) => s.main).length,
  );
  await expect(page.locator("li#laravel")).toBeVisible();
  await page
    .locator("li#laravel")
    .getByRole("link", { name: /Used in \d+ project/ })
    .click();
  await expect(page).toHaveURL(/\/projects\?skill=laravel/);
});

test("Education: expired certificates are marked from expires_at", async ({
  page,
}) => {
  const now = month();
  const expired = certifications.filter(
    (c) => c.status === "published" && c.expires_at && now > c.expires_at,
  );
  await page.goto("/education");
  await expect(page.getByText("GPA 3.52 / 4.00")).toBeVisible();
  // Indonesian course titles carry an English gloss; the original stays, marked as Indonesian.
  await expect(page.getByText("SQL Fundamentals")).toBeVisible();
  await expect(
    page.locator('[lang="id"]', { hasText: "Belajar Dasar SQL" }),
  ).toBeVisible();
  await expect(page.locator(".ui-badge--expired")).toHaveCount(expired.length);
  for (const c of expired)
    await expect(page.locator("li", { hasText: c.name })).toContainText(
      "Expired",
    );
});

test("Contact: CV, then LinkedIn, then GitHub, and no contact form", async ({
  page,
}) => {
  await page.goto("/contact");
  const titles = await page.locator(".ct-list .ui-list__title").allInnerTexts();
  expect(titles.filter((t) => t !== "Email")).toEqual([
    "CV",
    "LinkedIn",
    "GitHub",
  ]);
  await expect(page.getByRole("main").locator("form")).toHaveCount(0);
  const card = page.getByRole("region", { name: "Business card" });
  await expect(card).toContainText("WIB (UTC+7)");
  await expect(card).toContainText("Indonesian (native)");
  const download = page.waitForEvent("download");
  await page
    .getByRole("main")
    .getByRole("link", { name: /CV\.pdf/ })
    .click();
  expect((await download).suggestedFilename()).toBe(
    "Besar-Rachmat-Ikhsan-Pambudi-CV.pdf",
  );
});

test("one Download CV primary on Contact's screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contact");
  await expect(
    page.getByRole("link", { name: /Download CV/ }).filter({ visible: true }),
  ).toHaveCount(1);
});

const PATHS = ["/experience", "/skills", "/education", "/contact"];

test("no horizontal scroll at 320 px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const path of PATHS) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      path,
    ).toBe(320);
  }
});

test("no serious axe violations, light and dark", async ({ page }) => {
  test.slow(); // eight page loads + axe runs in one test
  for (const scheme of ["light", "dark"] as const)
    for (const path of PATHS) {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(
        violations.filter(
          (v) => v.impact === "serious" || v.impact === "critical",
        ),
        `${scheme} ${path}`,
      ).toEqual([]);
    }
});
