import { expect, test } from "@playwright/test";

test("user can logout successfully", async ({ page }) => {
  // 1. Start on a protected page (assuming storageState is set up)
  await page.goto("/app");
  await expect(page).toHaveURL(/\/app/);

  // 2. Trigger logout (via your UI or direct navigation)
  await page.goto("/logout");

  // 3. Verify redirect to login
  await expect(page).toHaveURL(/\/login/);

  // 4. Verify that trying to go back to /app redirects to login again
  await page.goto("/app");
  await expect(page).toHaveURL(/\/login/);
});
