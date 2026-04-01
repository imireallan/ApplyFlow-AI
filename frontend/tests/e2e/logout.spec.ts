import { expect, test } from "@playwright/test";

test("user can logout successfully", async ({ page, context }) => {
  const exp = Math.floor(Date.now() / 1000) + 604800;
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: "test-user-123",
      exp,
      email: "test@example.com",
    })
  );
  const fakeToken = `${header}.${payload}.fakesignature`;

  // Set auth cookie so the test-mode bypass in sessions.ts works
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

  // 1. Start on a protected page
  await page.goto("/app");
  await expect(page).toHaveURL(/\/app/);

  // 2. Trigger logout
  await page.goto("/logout");

  // 3. Verify redirect to login
  await expect(page).toHaveURL(/\/login/);

  // 4. Verify that visiting /app redirects to login after logout
  await page.goto("/app");
  await expect(page).toHaveURL(/\/login/);
});
