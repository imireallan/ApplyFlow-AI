import { data, redirect } from "react-router";
import type { User } from "~/types/user";
import { apiRequestHandler } from "./apiRequestHandler";

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
 * Uses apiRequestHandler for consistency with other API calls
 */
export async function getUserFromRequest(request: Request) {
  // Use apiRequestHandler which extracts token from cookie and adds Authorization header
  // Also forward cookies to ensure they're sent with the request
  const response = await apiRequestHandler(request, {
    endpoint: "/auth/me",
    method: "GET",
    forwardCookies: true, // Ensure cookies are forwarded
  });

  // apiRequestHandler returns a react-router data object
  // Access .data to get the actual response and .status for HTTP status
  const responseData = (response as any).data;
  const responseStatus = (response as any).status;

  if (responseStatus === 401) {
    return null;
  }

  // Extract user from response data
  const payload = responseData as User;

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
