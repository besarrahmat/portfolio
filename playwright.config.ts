import { defineConfig, devices } from "@playwright/test";

// BASE_URL set → smoke-test a deployed Worker; unset → local dev server on 3005.
const baseURL = process.env.BASE_URL ?? "http://localhost:3005";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: `${baseURL}/api/v1/health`,
        reuseExistingServer: !process.env.CI,
      },
});
