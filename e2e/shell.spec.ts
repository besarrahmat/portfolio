import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// The admin-panel shell (docs/PLAN.md Fase 6): Trunk Test, keyboard-only use, theme without a cookie, no-JS.
const desktop = { width: 1440, height: 900 };
const phone = { width: 390, height: 844 };
// The shell's topbar; /components also shows Header and Breadcrumbs demos inside <main>.
const top = (page: Page) => page.getByRole("banner");

// Krug's Trunk Test: site ID, page name, sections, where I am, search — plus the one primary action.
async function trunkTest(page: Page, pageName: string) {
  const crumbs = top(page).getByRole("navigation", { name: "Breadcrumb" });
  await expect(crumbs.locator('[aria-current="page"]')).toHaveText(pageName);
  await expect(
    top(page).getByRole("button", { name: "Search pages, projects, skills" }),
  ).toBeVisible();
  // Topbar/dock everywhere, except on Overview where the meishi holds it while on screen (docs/DESIGN.md §1).
  await expect(
    top(page)
      .or(page.locator(".meishi"))
      .getByRole("link", { name: /Download CV/ })
      .filter({ visible: true }),
  ).toHaveCount(1);
}

test.describe("Trunk Test", () => {
  for (const path of ["/", "/components", "/no-such-page"])
    test(`1440 px: ${path}`, async ({ page }) => {
      await page.setViewportSize(desktop);
      await page.goto(path);
      await expect(page.getByRole("link", { name: "Rahmat" })).toBeVisible();
      const nav = page.getByRole("navigation", { name: "Main" });
      await expect(nav).toBeVisible();
      const name = { "/": "Overview", "/components": "Design system" }[path];
      if (name)
        await expect(nav.locator('[aria-current="page"]')).toHaveText(name);
      else await expect(nav.locator('[aria-current="page"]')).toHaveCount(0);
      await trunkTest(page, name ?? "Not found");
    });

  for (const path of ["/", "/components", "/no-such-page"])
    test(`390 px: ${path}`, async ({ page }) => {
      await page.setViewportSize(phone);
      await page.goto(path);
      // On phones the site ID is the first crumb; sections sit behind the Menu button.
      await expect(
        top(page)
          .getByRole("navigation", { name: "Breadcrumb" })
          .getByRole("link", { name: "Rahmat" }),
      ).toBeVisible();
      await expect(
        top(page).getByRole("button", { name: "Menu", exact: true }),
      ).toBeVisible();
      const name = { "/": "Overview", "/components": "Design system" }[path];
      await trunkTest(page, name ?? "Not found");
    });
});

test("keyboard only: skip link, sidebar, ⌘K / Ctrl+K palette", async ({
  page,
}) => {
  await page.setViewportSize(desktop);
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();

  // Tab into the sidebar and follow a link with Enter.
  const designSystem = page
    .getByRole("navigation", { name: "Main" })
    .getByRole("link", { name: "Design system" });
  for (
    let i = 0;
    i < 12 &&
    !(await designSystem.evaluate((e) => e === document.activeElement));
    i++
  )
    await page.keyboard.press("Tab");
  await expect(designSystem).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/components$/);

  // The shortcut follows the OS (Meta on macOS, Control elsewhere), as does Playwright's ControlOrMeta.
  await page.locator("body").click({ position: { x: 1, y: 1 } });
  await page.keyboard.press("ControlOrMeta+k");
  const input = page.getByRole("combobox", {
    name: "Search pages, projects and skills",
  });
  await expect(input).toBeFocused();
  await page.keyboard.type("Overview");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/$/);
  await expect(input).toBeHidden();
});

test("palette lists projects and skills from D1, and Esc closes it", async ({
  page,
}) => {
  await page.setViewportSize(desktop);
  await page.goto("/components");
  await top(page)
    .getByRole("button", { name: "Search pages, projects, skills" })
    .click();
  const input = page.getByRole("combobox", {
    name: "Search pages, projects and skills",
  });
  // The key hint is the input's description, so screen readers hear it too.
  await expect(input).toHaveAccessibleDescription(
    "Arrow keys to move, Enter to open, Esc to close.",
  );
  await input.fill("sobat");
  await expect(page.getByRole("option", { name: "SOBAT-PS" })).toBeVisible();
  await input.fill("laravel");
  await expect(
    page.getByRole("option", { name: "Laravel", exact: true }),
  ).toBeVisible();
  await input.fill("zzzz");
  await expect(page.getByText("No match.")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(input).toBeHidden();
});

test("the shortcut is left alone while typing in a field", async ({ page }) => {
  await page.setViewportSize(desktop);
  await page.goto("/components");
  await page.locator("#text-input input").first().focus();
  await page.keyboard.press("ControlOrMeta+k");
  await expect(
    page.getByRole("combobox", { name: "Search pages, projects and skills" }),
  ).toHaveCount(0);
});

test("the menu sheet closes once a link is followed", async ({ page }) => {
  await page.setViewportSize(phone);
  await page.goto("/components");
  await top(page).getByRole("button", { name: "Menu", exact: true }).click();
  const sheet = page.getByRole("dialog", { name: "Menu" });
  await sheet.getByRole("link", { name: "Overview" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(sheet).toBeHidden();
});

test.describe("theme", () => {
  test("is never a cookie: the server sends one HTML for everyone", async ({
    request,
  }) => {
    const res = await request.get("/components");
    expect(res.headers()["set-cookie"]).toBeUndefined();
    expect(await res.text()).not.toMatch(/<html[^>]*data-theme/);
  });

  test("the stored choice is applied before <body> exists (no flash)", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.addInitScript(() => {
      localStorage.setItem("theme", "light");
      // Record whether <body> existed when data-theme first appeared.
      new MutationObserver((_, observer) => {
        if (!document.documentElement.dataset.theme) return;
        (window as unknown as { bodyAtTheme: boolean }).bodyAtTheme =
          document.body !== null;
        observer.disconnect();
        // <html> does not exist yet when init scripts run, so watch the whole document.
      }).observe(document, {
        subtree: true,
        attributes: true,
        attributeFilter: ["data-theme"],
      });
    });
    await page.goto("/components");
    expect(
      await page.evaluate(
        () => (window as unknown as { bodyAtTheme: boolean }).bodyAtTheme,
      ),
    ).toBe(false);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(
      page.locator(".shell-sidebar").getByRole("button", { name: "Light" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("System removes the choice and follows the device", async ({ page }) => {
    await page.setViewportSize(desktop);
    await page.goto("/components");
    const theme = page.locator(".shell-sidebar");
    await theme.getByRole("button", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await theme.getByRole("button", { name: "System" }).click();
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /./);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false, viewport: phone });

  test("every page and the CV stay reachable as plain links", async ({
    page,
  }) => {
    await page.goto("/components");
    const all = page.getByRole("navigation", { name: "All pages" });
    for (const name of ["Overview", "Projects", "Contact", "Design system"])
      await expect(all.getByRole("link", { name })).toBeVisible();
    await expect(
      top(page).getByRole("link", { name: /Download CV/ }),
    ).toHaveAttribute("href", "/cv");
    // Controls that need JS step aside instead of doing nothing.
    await expect(
      top(page).getByRole("button", { name: "Menu", exact: true }),
    ).toBeHidden();
    await expect(
      top(page).getByRole("button", { name: "Search pages, projects, skills" }),
    ).toBeHidden();
  });
});

test.describe("phone layout", () => {
  for (const viewport of [
    { width: 320, height: 640 },
    { width: 844, height: 390 }, // landscape
  ])
    test(`no horizontal scroll and the dock covers nothing at ${viewport.width}×${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        ),
      ).toBeLessThanOrEqual(0);
      // Scrolled to the end, the last footer link is still the topmost element where it sits.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      const last = page
        .getByRole("navigation", { name: "All pages" })
        .getByRole("link")
        .last();
      const box = await last.boundingBox();
      if (!box) throw new Error("footer link not laid out");
      const hit = await page.evaluate(
        ([x, y]) => document.elementFromPoint(x, y)?.closest("a")?.textContent,
        [box.x + box.width / 2, box.y + box.height / 2],
      );
      expect(hit).toBe("Design system");
    });
});

test.describe("axe on shell pages", () => {
  for (const colorScheme of ["light", "dark"] as const)
    for (const viewport of [desktop, phone])
      test(`/ and 404, ${colorScheme}, ${viewport.width} px`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.emulateMedia({ colorScheme });
        for (const path of ["/", "/no-such-page"]) {
          await page.goto(path);
          await page.waitForLoadState("networkidle");
          const { violations } = await new AxeBuilder({ page }).analyze();
          expect(
            violations
              .filter((v) => v.impact === "serious" || v.impact === "critical")
              .map(
                (v) =>
                  `${path} ${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`,
              ),
          ).toEqual([]);
        }
      });
});

// React reports duplicate keys and hydration mismatches only in the console (a duplicate "/" crumb key slipped once).
test("shell pages log no React errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    // 404s for Fase 7 pages that links prefetch are expected until those pages exist.
    if (m.type() === "error" && !m.text().startsWith("Failed to load resource"))
      errors.push(m.text());
  });
  for (const path of ["/", "/components", "/no-such-page"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
  }
  expect(errors).toEqual([]);
});
