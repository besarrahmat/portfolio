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

  test("the Stack column leads with the main stack and folds the rest", async ({
    page,
  }) => {
    await page.goto("/projects");
    const sobat = rows(page).filter({ hasText: "SOBAT-PS" });
    await expect(sobat.locator(".pj-stack b")).toHaveText(["Laravel", "PHP"]);
    const nikke = rows(page).filter({ hasText: "NIKKE" });
    await expect(nikke.locator(".pj-stack small")).toContainText(/^\+\d+/);
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

  test("the record opens with its diagram, then the story; old ?tab= links land on the same page", async ({
    page,
  }) => {
    for (const path of [
      "/projects/sobat-ps",
      "/projects/sobat-ps?tab=architecture",
    ]) {
      await page.goto(path);
      await expect(
        page.getByRole("navigation", { name: "Project views" }),
      ).toHaveCount(0);
      const diagram = page.getByRole("region", { name: "Architecture" });
      const story = page.getByRole("heading", { name: "Problem" });
      await expect(diagram).toBeVisible();
      const [d, st] = [await diagram.boundingBox(), await story.boundingBox()];
      expect(d && st && d.y < st.y).toBe(true);
    }
  });

  test("the diagram is drawn from the architecture JSON", async ({ page }) => {
    const sobat = published.find((p) => p.slug === "sobat-ps");
    await page.goto("/projects/sobat-ps");
    const nodes = page.locator(".pd-arch .pd-node");
    await expect(nodes).toHaveCount(sobat?.architecture?.nodes.length ?? -1);
    for (const n of sobat?.architecture?.nodes ?? [])
      await expect(nodes.filter({ hasText: n.label })).toHaveCount(1);
    // Every edge is drawn as a labelled connector and listed for screen readers.
    await expect(page.locator(".pd-link li")).toHaveCount(
      sobat?.architecture?.edges.length ?? -1,
    );
    await expect(page.locator(".pd-diagram figcaption li")).toHaveCount(
      sobat?.architecture?.edges.length ?? -1,
    );
  });

  test("a record without a case study is a table row only, with no page", async ({
    page,
  }) => {
    await page.goto("/projects");
    const row = rows(page).filter({ hasText: "PT HTSI web profile" });
    await expect(row).toContainText("No write-up yet");
    await expect(row.getByRole("link")).toHaveCount(0);
    await page.goto("/projects/htsi-web-profile");
    await expect(
      page.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
  });

  test("facts sit with the record: live link by the Live state, private repos badged, crumb named", async ({
    page,
  }) => {
    await page.goto("/projects/sobat-ps");
    const facts = page.getByRole("complementary", { name: "Project facts" });
    await expect(
      facts.locator(".pd-props__state").getByRole("link", {
        name: /sobat-ps\.kaltaraprov\.go\.id/,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("complementary", { name: "More about this project" }),
    ).toContainText("Private repo");
    await expect(
      page.getByRole("banner").getByRole("navigation", { name: "Breadcrumb" }),
    ).toContainText("SOBAT-PS");
  });

  test("the record never dead-ends: next project and all projects", async ({
    page,
  }) => {
    await page.goto("/projects/sobat-ps");
    const more = page.getByRole("navigation", { name: "More projects" });
    await expect(
      more.getByRole("link", { name: "All projects" }),
    ).toBeVisible();
    await more.getByRole("link", { name: /PolicySemVer/ }).click();
    await expect(page).toHaveURL(/\/projects\/policy-semver$/);
    await expect(
      page
        .getByRole("navigation", { name: "More projects" })
        .getByRole("link", { name: /SOBAT-PS/ }),
    ).toBeVisible();
  });

  test("Design system is reachable from the portfolio record", async ({
    page,
  }) => {
    await page.goto("/projects/portfolio");
    await page
      .getByRole("complementary", { name: "More about this project" })
      .getByRole("link", { name: "Design system" })
      .click();
    await expect(page).toHaveURL(/\/components$/);
  });

  test("a stack chip lists the other projects using it", async ({ page }) => {
    await page.goto("/projects/sobat-ps");
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
      .getByRole("region", { name: "On the table" })
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
  for (const path of ["/projects", "/projects/nikke-calculator"]) {
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
    for (const path of ["/projects", "/projects/policy-semver"]) {
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
