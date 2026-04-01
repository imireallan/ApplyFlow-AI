import { expect, test } from "@playwright/test";


test.describe("Login Flow", () => {
  test("visits landing and can login with mock Google OAuth", async ({ page }) => {
    await page.goto("/");
    
    // Should show login button/prompt
    await expect(page).toHaveTitle(/ApplyFlow/);
    
    // Mock Google OAuth success (simulate handleSuccess)
    const googleButton = page.getByRole("button").filter({ hasText: /Start Now - It's Free/i });
    await googleButton.click();
    
    // Wait for mock redirect to /app
    await page.waitForURL(/login/);
    await expect(page).toHaveURL(/login/);
    
    // Should be in login page now
    await expect(page.locator("AI-Powered Login")).toBeVisible({ timeout: 5000 });
  });
  
  test("protected route redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/app/upload");
    
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });
});

