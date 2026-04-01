import { defineConfig, devices } from "@playwright/test";
import path from "path";

/**
 * Path where the authenticated session state will be stored.
 * Add this directory to your .gitignore.
 */
export const STORAGE_STATE = path.join(__dirname, "playwright/.auth/user.json");

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["json", { outputFile: "test-results.json" }]],

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    // --- 1. SETUP PHASE ---
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },

    // --- 2. AUTHENTICATED E2E PHASE ---
    {
      name: "chromium-auth",
      use: {
        ...devices["Desktop Chrome"],
        storageState: STORAGE_STATE,
      },
      dependencies: ["setup"],
    },

    // --- 3. UNAUTHENTICATED / CROSS-BROWSER PHASE ---
    // Use these for testing the Landing Page and Login Flow specifically
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",
  },
});
