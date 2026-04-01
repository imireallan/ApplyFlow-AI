import { expect, test as setup } from "@playwright/test";
import { STORAGE_STATE } from "../../playwright.config";

setup("authenticate", async ({ page }) => {
  // 1. Intercept the login action to mock the backend response
  // This matches your FastAPI /google endpoint
  await page.route("**/auth/google", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        // We set the cookie exactly as FastAPI would
        "Set-Cookie":
          "access_token=mock-access-token; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800;",
      },
      body: JSON.stringify({
        message: "Login successful",
        access_token: "mock-access-token",
        token_type: "bearer",
      }),
    });
  });

  // 2. Intercept the 'me' call so the Root Loader thinks we are valid
  await page.route("**/auth/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "user-123",
        email: "allan@example.com",
        full_name: "Allan Imire",
        first_name: "Allan",
        last_name: "Imire",
        picture_url: "https://example.com/photo.jpg",
      }),
    });
  });

  // 3. Navigate to login and trigger the flow
  await page.goto("/login");

  // Click the button that triggers your handleSuccess/submit logic
  // If you added a 'Mock Login' button for dev, click that.
  // Otherwise, we can trigger the form submission directly.
  const loginButton = page
    .getByRole("button")
    .filter({ hasText: /AI-Powered Login/i });

  // Note: Since we're mocking the network, clicking this should
  // trigger your React Router action, which calls our mocked /google route.
  await loginButton.click();

  // 4. Wait for the redirect to the dashboard
  await page.waitForURL(/\/app/);
  await expect(page.locator("body")).toContainText(/ApplyFlow/i);

  // 5. SAVE THE STATE
  // This is what creates playwright/.auth/user.json
  await page.context().storageState({ path: STORAGE_STATE });
});
