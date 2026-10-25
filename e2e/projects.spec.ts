import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import projects from "../content/seed/projects.json";

// Projects index + detail (docs/PLAN.md Fase 7).
const desktop = { width: 1440, height: 900 };
const phone = { width: 390, height: 844 };
const published = projects.filter((p) => p.status === "published");
const rows = (page: Page) =>
  page.getByRole("region", { name: "Projects" }).locator("tbody tr");

test.describe("index", () => {
  test.use({ viewport: desktop });

  test("lists every published project with its number, in order", async ({
    page,
  }) => {
    await page.goto("/projects");
    await expect(rows(page)).toHaveCount(published.length);
    await expect(rows(page).first()).toContainText("001");
    await expect(rows(page).first()).toContainText("SOBAT-PS");
  });

  test("kind filter, search and sort live in the URL", async ({ page }) => {
    await page.goto("/projects");
    const filter = page.getByRole("navigation", { name: "Filter by kind" });
    await filter.getByRole("link", { name: /^Work/ }).click();
    await expect(page).toHaveURL(/kind=work/);
    await expect(filter.locator('[aria-current="page"]')).toContainText("Work");
    await expect(rows(page)).toHaveCount(
      published.filter((p) => p.kind === "work").length,
    );

    await page.goto("/projects?q=laravel");
    for (const row of await rows(page).all())
      await expect(row).toContainText(/Laravel/i);

    await page.goto("/projects?sort=name");
    const names = await rows(page).locator("th").allInnerTexts();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test("searching from the form works with JS", async ({ page }) => {
    await page.goto("/projects");
    await page
      .getByRole("searchbox", { name: "Search projects" })
      .fill("nikke");
    await page.getByRole("button", { name: "Search", exact: true }).click();
    await expect(page).toHaveURL(/q=nikke/);
    await expect(rows(page)).toHaveCount(1);
  });

  test("no match shows an empty state that clears the filters", async ({
    page,
  }) => {
    await page.goto("/projects?q=zzzz");
    const table = page.getByRole("region", { name: "Projects" });
    await expect(table).toContainText("No project matches");
    await table.getByRole("link", { name: "Clear filters" }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(rows(page)).toHaveCount(published.length);
  });

  test("phones get record cards instead of the table", async ({ page }) => {
    await page.setViewportSize(phone);
    await page.goto("/projects");
    await expect(page.getByRole("region", { name: "Projects" })).toBeHidden();
    await expect(
      page.locator(".pj-cards").getByRole("link", { name: /SOBAT-PS/ }),
    ).toBeVisible();
  });
});

test.describe("detail", () => {
  test.use({ viewport: desktop });

  test("views are tabs in ?tab=, so Back and shared links work", async ({
    page,
  }) => {
    await page.goto("/projects/sobat-ps");
    const views = page.getByRole("navigation", { name: "Project views" });
    await views.getByRole("link", { name: "Architecture" }).click();
    await expect(page).toHaveURL(/tab=architecture/);
    await expect(views.locator('[aria-current="page"]')).toHaveText(
      "Architecture",
    );
    await page.goBack();
    await expect(views.locator('[aria-current="page"]')).toHaveText("Overview");

    await page.goto("/projects/sobat-ps?tab=nonsense");
    await expect(views.locator('[aria-current="page"]')).toHaveText("Overview");
  });

  test("the diagram is drawn from the architecture JSON", async ({ page }) => {
    const sobat = published.find((p) => p.slug === "sobat-ps");
    await page.goto("/projects/sobat-ps?tab=architecture");
    const nodes = page.locator(".pd-node");
    await expect(nodes).toHaveCount(sobat?.architecture?.nodes.length ?? -1);
    for (const n of sobat?.architecture?.nodes ?? [])
      await expect(nodes.filter({ hasText: n.label })).toHaveCount(1);
    await expect(page.locator(".pd-edges li")).toHaveCount(
      sobat?.architecture?.edges.length ?? -1,
    );
  });

  test("views without data are left out, not shown empty", async ({ page }) => {
    await page.goto("/projects/htsi-web-profile");
    const views = page.getByRole("navigation", { name: "Project views" });
    await expect(views.getByRole("link", { name: "Architecture" })).toHaveCount(
      0,
    );
    await expect(views.getByRole("link", { name: "Links" })).toHaveCount(0);
    await page.goto("/projects/htsi-web-profile?tab=links");
    await expect(views.locator('[aria-current="page"]')).toHaveText("Overview");
  });

  test("private repos carry a badge and no URL; the crumb names the record", async ({
    page,
  }) => {
    await page.goto("/projects/sobat-ps?tab=links");
    await expect(page.locator(".pd-links")).toContainText("Private repo");
    await expect(
      page.getByRole("banner").getByRole("navigation", { name: "Breadcrumb" }),
    ).toContainText("SOBAT-PS");
  });

  test("a stack chip lists the other projects using it", async ({ page }) => {
    await page.goto("/projects/sobat-ps?tab=stack");
    await page.locator(".pd-stack a", { hasText: "Laravel" }).click();
    await expect(page).toHaveURL(/skill=/);
    await expect(page.locator(".pj-status")).toContainText("using Laravel");
  });

  test("an unknown slug shows the not-found page and is not indexed", async ({
    page,
  }) => {
    await page.goto("/projects/no-such-project");
    await expect(
      page.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
    await expect(
      page.locator('meta[name="robots"][content*="noindex"]').first(),
    ).toBeAttached();
  });
});

for (const [label, viewport] of [
  ["desktop", desktop],
  ["phone", phone],
] as const)
  test(`${label}: arrive → open a project → Download CV (three steps)`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page
      .locator(".ov-section")
      .getByRole("link", { name: /SOBAT-PS/ })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "SOBAT-PS",
    );
    const download = page.waitForEvent("download");
    await page
      .getByRole("banner")
      .getByRole("link", { name: /Download CV/ })
      .click();
    expect((await download).suggestedFilename()).toBe(
      "Besar-Rachmat-Ikhsan-Pambudi-CV.pdf",
    );
  });

test("no horizontal scroll at 320 px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const path of [
    "/projects",
    "/projects/nikke-calculator?tab=architecture",
  ]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(320);
  }
});

test("no serious axe violations on the index and a detail view", async ({
  page,
}) => {
  for (const scheme of ["light", "dark"] as const)
    for (const path of [
      "/projects",
      "/projects/policy-semver?tab=architecture",
    ]) {
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
