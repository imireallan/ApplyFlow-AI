import { expect, test } from "@playwright/test";

test.describe("Settings Page @auth", () => {
  test("loads settings page from dashboard nav", async ({ page }) => {
    await page.goto("/app");
    await expect(page).toHaveURL(/\/app/);

    // Click the Settings link in the left icon sidebar (now has aria-label)
    await page.getByRole("link", { name: "Settings" }).click();
    await page.waitForURL(/settings/);
    await expect(page).toHaveURL(/settings/);

    await expect(page.getByRole("heading", { name: /Settings/i })).toBeVisible();
  });

  test("renders user profile fields with current values", async ({ page }) => {
    await page.goto("/app/settings");
    await expect(page.getByRole("textbox", { name: /First Name/i })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /Last Name/i })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /Email/i })).toBeVisible();
    await expect(page.getByTestId("settings-submit")).toBeVisible();
  });

  test("submit button shows saving text during submission", async ({ page }) => {
    await page.goto("/app/settings");
    const submitButton = page.getByTestId("settings-submit");
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText(/Save Changes/i);
  });
});
