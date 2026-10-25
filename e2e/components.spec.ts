import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// Base UI links labels (aria-labelledby) after hydration; audit the page people actually use.
const gotoHydrated = async (page: Page) => {
  await page.goto("/components");
  await page.waitForFunction(() =>
    [
      ...document.querySelectorAll(
        ".ui-select, [role=checkbox], [role=switch], [role=radio], [role=progressbar]",
      ),
    ].every((e) => e.hasAttribute("aria-labelledby")),
  );
};

const seriousViolations = async (page: Page) => {
  const { violations } = await new AxeBuilder({ page }).analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map(
      (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
    );
};

// /components is the regression suite for the component module (docs/PLAN.md Fase 5).
test.describe("/components", () => {
  for (const colorScheme of ["light", "dark"] as const)
    test(`no serious axe violations (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await gotoHydrated(page);
      expect(await seriousViolations(page)).toEqual([]);
    });

  test("no serious axe violations in forced colours with reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({
      forcedColors: "active",
      reducedMotion: "reduce",
    });
    await gotoHydrated(page);
    expect(await seriousViolations(page)).toEqual([]);
  });

  // 320 px CSS width = a 1280 px window at 400%; 640 px = 1280 px at 200% (WCAG 1.4.10 reflow).
  for (const width of [320, 640])
    test(`no horizontal page scroll at ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/components");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });

  test("first Tab lands on the skip link", async ({ page }) => {
    await page.goto("/components");
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeFocused();
  });

  test("Download CV goes ready → downloading → done with the real file name", async ({
    page,
  }) => {
    const pdf = Buffer.from("%PDF-1.4\n% test CV\n".repeat(2000));
    let release: () => void = () => {};
    const held = new Promise<void>((r) => {
      release = r;
    });
    await page.route("/cv", async (route) => {
      await held; // hold the response so the downloading state can be observed
      await route.fulfill({
        body: pdf,
        headers: {
          "content-type": "application/pdf",
          "content-length": String(pdf.length),
        },
      });
    });
    await gotoHydrated(page);
    const button = page.locator("#file .ui-file").first().getByRole("link");
    await expect(button).toContainText("Download CV");
    const download = page.waitForEvent("download");
    await button.click();
    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(button).toContainText("Downloading");
    release();
    expect((await download).suggestedFilename()).toBe(
      "Besar-Rachmat-Ikhsan-Pambudi-CV.pdf",
    );
    await expect(button).toContainText("Downloaded");
    await expect(button).not.toHaveAttribute("aria-busy");
  });

  // Values cross the server/client boundary as copies, so matching must be by value, not by reference.
  test("picking a preselected skill unselects it instead of adding a duplicate", async ({
    page,
  }) => {
    const keyErrors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error" && m.text().includes("same key"))
        keyErrors.push(m.text());
    });
    await gotoHydrated(page);
    const field = page
      .locator("#combobox")
      .getByRole("combobox", { name: "Skills used" });
    const chips = page.locator("#combobox .ui-combobox__chip");
    await expect(chips).toHaveCount(3);
    // A server refresh re-sends the items as new objects while the chosen chips keep the old ones.
    const refreshed = page.waitForResponse((r) => r.url().includes("_rsc"));
    await page.evaluate(() =>
      (
        window as unknown as { next: { router: { refresh(): void } } }
      ).next.router.refresh(),
    );
    await (await refreshed).finished();
    await page.waitForTimeout(500); // let React commit the new payload
    await field.fill("PHP");
    await page.getByRole("option", { name: "PHP", exact: true }).click();
    await expect(chips).toHaveCount(2);
    await expect(chips.filter({ hasText: "PHP" })).toHaveCount(0);
    expect(keyErrors).toEqual([]);
  });

  test("pinned File states stay put and upload hints name the file type", async ({
    page,
  }) => {
    await gotoHydrated(page);
    await page.locator("#file .ui-file").nth(2).getByRole("link").click();
    await expect(page).toHaveURL(/\/components/);
    await expect(page.locator("#file-upload")).toContainText(
      "WEBP, up to 1.0 MB",
    );
  });

  test("a failed download offers LinkedIn instead", async ({ page }) => {
    await page.route("/cv", (route) =>
      route.fulfill({ status: 404, body: "" }),
    );
    await gotoHydrated(page);
    await page.locator("#file .ui-file").first().getByRole("link").click();
    const alert = page.locator("#file .ui-file").first().getByRole("alert");
    await expect(alert).toContainText("The download failed");
    await expect(alert.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/besarrahmat",
    );
  });
});
