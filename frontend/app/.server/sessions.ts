import { redirect } from "react-router";
import { getUserHandler } from "./user";
import { isApiError } from "~/helpers/apiError";

const COOKIE_NAME = "access_token";

/**
 * Decode a JWT token and return the payload
 */
export function decodeJwt(token: string): { exp: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

/** Check if a JWT token is expired */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return true;
  const buffer = 30;
  return (payload.exp - buffer) * 1000 < Date.now();
}

/** Get the raw JWT token from the request cookie */
export function getAccessToken(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]*)`));
  return match ? match[1] : null;
}

/** Create a session by setting the access_token cookie */
export async function createTokenSession({
  accessToken,
  redirectTo,
}: {
  accessToken: string;
  redirectTo: string;
}) {
  const maxAge = 7 * 24 * 60 * 60; // 7 days
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": `${COOKIE_NAME}=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge};`,
    },
  });
}

/** Destroy the session */
export async function destroyTokenSession(request: Request) {
  return redirect("/login", {
    headers: {
      "Set-Cookie": `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;`,
    },
  });
}

/** Get user from request by calling the backend API */
export async function getUserFromRequest(request: Request) {
  // Test-mode bypass: when running e2e tests with mock session,
  // return a mock user without hitting the real backend.
  // VITE_TEST_MOCK is set in .env.test (loaded by Vite during e2e runs).
  if (typeof process !== "undefined" && process.env.TEST_MOCK === "true") {
    const token = getAccessToken(request);
    if (token && decodeJwt(token)) {
      return {
        id: "test-user-123",
        email: "test@example.com",
        full_name: "Test User",
        first_name: "Test",
        last_name: "User",
        picture_url: "https://example.com/avatar.png",
      };
    }
  }

  const res = await getUserHandler(request);
  if (!res.ok || res.status === 401) return null;

  if (!res.ok || isApiError(res.data)) return null;

  const payload = res.data;
  return {
    id: payload?.id || "",
    email: payload?.email,
    full_name: payload?.full_name,
    first_name: payload?.first_name,
    last_name: payload?.last_name,
    picture_url: payload?.picture_url,
  };
}

/** Require a user - throws redirect to login if not authenticated */
export async function requireUser(request: Request) {
  const token = getAccessToken(request);
  if (!token || isTokenExpired(token)) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams([["redirectTo", url.pathname]]);
    throw redirect(`/login?${searchParams}`);
  }

  const user = await getUserFromRequest(request);
  if (!user) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams([["redirectTo", url.pathname]]);
    throw redirect(`/login?${searchParams}`);
  }

  return user;
}

/** Get the user token from the request */
export async function getUserToken(request: Request) {
  return getAccessToken(request);
}

/** Require a user token - throws redirect if not present */
export async function requireUserToken(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const userToken = await getUserToken(request);
  if (!userToken) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userToken;
}
