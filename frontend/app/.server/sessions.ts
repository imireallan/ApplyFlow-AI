import { redirect } from "react-router";
import { getUserHandler } from "./user";
import { isApiError } from "~/helpers/apiError";

const COOKIE_NAME = "access_token";

/**
 * Decode a JWT token and return the payload
 * Note: This is a basic decoder without signature verification
 * For full security, the backend should verify the token
 */
export function decodeJwt(token: string): { exp: number } | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

/**
 * Check if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return true;

  const buffer = 30; // 30 seconds leeway
  return (payload.exp - buffer) * 1000 < Date.now();
}

/**
 * Get the raw JWT token from the request cookie
 */
export function getAccessToken(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  // Parse access_token from cookie string
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

/**
 * Create a session by setting the access_token cookie
 */
export async function createTokenSession({
  accessToken,
  redirectTo,
}: {
  accessToken: string;
  redirectTo: string;
}) {
  // 7 days in seconds: 7 days * 24 hours * 60 minutes * 60 seconds
  const DAYS_TO_SECONDS = 24 * 60 * 60;
  const maxAge = 7 * DAYS_TO_SECONDS; // 604,800 seconds

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": `${COOKIE_NAME}=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge};`,
    },
  });
}

/**
 * Destroy the session by clearing the cookie
 */
export async function destroyTokenSession(request: Request) {
  return redirect("/login", {
    headers: {
      // Clear cookie by setting expired time in the past and same attributes as when created
      "Set-Cookie": `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;`,
    },
  });
}

/**
 * Get user from request by calling the backend API
 * Uses apiRequestHandler for consistency with other API calls
 */
export async function getUserFromRequest(request: Request) {
  const res = await getUserHandler(request);

  if (!res.ok) {
    if (res.status === 401) return null;
    return null;
  }

  if (!res.ok || isApiError(res.data)) {
    if (res.status === 401) return null;
    return null
  }

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

/**
 * Require a user - throws redirect to login if not authenticated
 */
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

/**
 * Get the user token from the request
 */
export async function getUserToken(request: Request) {
  return getAccessToken(request);
}

/**
 * Require a user token - throws redirect to login if not present
 */
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
