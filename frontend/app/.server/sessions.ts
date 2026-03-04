import { data, redirect } from "react-router";
import type { User } from "~/types/user";

const API_URL = import.meta.env.VITE_AI_API_URL;
const COOKIE_NAME = "access_token";

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
  request: Request;
  accessToken: string;
  redirectTo: string;
}) {
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": `${COOKIE_NAME}=${accessToken}`,
    },
  });
}

/**
 * Destroy the session by clearing the cookie
 */
export async function destroyTokenSession(request: Request) {
  return redirect("/login", {
    headers: {
      "Set-Cookie": `${COOKIE_NAME}=`,
    },
  });
}

/**
 * Get user from request by calling the backend API
 */
export async function getUserFromRequest(request: Request) {
  const cookieHeader = request.headers.get("Cookie");

  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { cookie: cookieHeader ?? "" },
    credentials: "include",
  });

  if (res.status === 401) {
    return null;
  }

  const payload = await res.json();

  const user: User = {
    id: payload.id,
    email: payload.email,
    full_name: payload.full_name,
    first_name: payload.first_name,
    last_name: payload.last_name,
    picture_url: payload.picture_url,
  };
  return data(user, { status: 200 });
}

/**
 * Require a user - throws redirect to login if not authenticated
 */
export async function requireUser(request: Request) {
  const user = await getUserFromRequest(request);

  if (!user) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams([["redirectTo", url.pathname]]);

    throw redirect(`/login?${searchParams}`);
  }

  return user.data;
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
