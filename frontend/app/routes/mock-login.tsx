/**
 * Mock login endpoint for E2E testing.
 * Creates a fake session and redirects to /app without calling the real backend.
 * Only active when VITE_TEST_MOCK=true.
 */
import { redirect } from "react-router";
import { createTokenSession } from "~/.server/sessions";

export const action = async ({ request }: { request: Request }) => {
  // This is a dev-only route not mounted in production.
  const formData = await request.formData();
  const redirectTo = (formData.get("redirectTo") as string) || "/app";

  // Generate a fake JWT-like token with an exp 7 days from now
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

  return createTokenSession({
    accessToken: fakeToken,
    redirectTo,
  });
};

export const loader = async () => {
  return redirect("/login");
};
