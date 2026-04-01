import { expect, test } from "@playwright/test";

test.describe("Login Flow", () => {
  test("visits landing and can navigate to app when authenticated", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/ApplyFlow/);

    const startButton = page
      .getByRole("button")
      .filter({ hasText: /Start Now/i });
    await expect(startButton).toBeVisible({ timeout: 5000 });
    await startButton.click();

    // In the authenticated test environment, Start Now goes straight to /app
    await page.waitForURL(/\/app/);
    await expect(page).toHaveURL(/\/app/);
  });

  test("protected route redirects to login when unauthenticated", async ({
    page,
    context,
  }) => {
    await context.clearCookies();

    await page.goto("/app/upload");
    await expect(page).toHaveURL(/login/);
  });
});
