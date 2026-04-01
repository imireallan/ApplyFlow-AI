import { test as base } from "@playwright/test";

/**
 * Extended test with authenticated context that automatically
 * mocks the /auth/me backend call. This prevents server-side
 * requireUser() from hitting the real backend and redirecting
 * to login.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // Intercept server-side user info API calls and return mock data
    await page.route("**/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "test-user-123",
          email: "test@example.com",
          full_name: "Test User",
          first_name: "Test",
          last_name: "User",
          picture_url: "https://example.com/avatar.png",
        }),
      });
    });

    await use(page);
  },
});

export { expect } from "@playwright/test";
