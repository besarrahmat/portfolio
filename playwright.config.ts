import { defineConfig, devices } from "@playwright/test";

// BASE_URL set → smoke-test a deployed Worker; unset → local dev server on 3005.
const baseURL = process.env.BASE_URL ?? "http://localhost:3005";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /(cv-missing|email)\.spec\.ts/,
    },
    // These edit the shared local D1 (CV key, email alias), so they run after everything else and one after
    // the other: two wrangler writes at once lock the local SQLite file. Local only.
    {
      name: "local-d1-cv",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /cv-missing\.spec\.ts/,
      dependencies: ["chromium"],
    },
    {
      name: "local-d1-email",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /email\.spec\.ts/,
      dependencies: ["local-d1-cv"],
    },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: `${baseURL}/api/v1/health`,
        reuseExistingServer: !process.env.CI,
      },
});
