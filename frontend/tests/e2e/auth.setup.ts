import { test as setup } from "@playwright/test";
import { STORAGE_STATE } from "../../playwright.config";

setup("authenticate", async ({ page, context }) => {
  // Generate a fake JWT-like token with an exp 7 days from now
  const exp = Math.floor(Date.now() / 1000) + 604800;

  // Encode header and payload
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: "test-user-123",
      exp,
      email: "test@example.com",
      first_name: "Test",
      last_name: "User",
      full_name: "Test User",
      picture_url: "https://example.com/avatar.png",
    })
  );
  const fakeToken = `${header}.${payload}.fakesignature`;

  // Set the access_token cookie directly in the browser context
  await context.addCookies([
    {
      name: "access_token",
      value: fakeToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);

  // Navigate to trigger a page load (cookie is set regardless of redirect)
  await page.goto("/app/upload");

  // Save the authenticated browser context to disk.
  await page.context().storageState({ path: STORAGE_STATE });
});
