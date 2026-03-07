import { data } from "react-router";

const API_URL = import.meta.env.VITE_AI_API_URL;
const COOKIE_NAME = "access_token";

// Routes that should NOT include the authentication
const EXCLUDED_ROUTES = ["/auth/google", "/auth/logout"];

/**
 * Get the access token from request cookies
 */
function getAccessToken(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

/**
 * Check if a route should exclude authentication
 */
function isExcludedRoute(endpoint: string): boolean {
  return EXCLUDED_ROUTES.some((route) => endpoint.startsWith(route));
}

/**
 * Options for the API request handler
 */
interface ApiRequestOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: FormData | Record<string, unknown> | string | null;
  headers?: Record<string, string>;
  forwardCookies?: boolean;
  raw?: boolean; // If true, returns raw Response object
}

/**
 * Reusable fetch handler that adds Authorization header to requests
 * (except for login and logout endpoints)
 *
 * @param request - The original request object
 * @param options - API request options including endpoint, method, and body
 * @returns Response data or error
 */
export async function apiRequestHandler(
  request: Request,
  {
    endpoint,
    method = "GET",
    body = null,
    headers = {},
    forwardCookies = false,
    raw = false,
  }: ApiRequestOptions,
) {
  const url = `${API_URL}${endpoint}`;
  const isExcluded = isExcludedRoute(endpoint);

  // Build headers object
  const requestHeaders: Record<string, string> = { ...headers };

  // Add Authorization header for non-excluded routes
  if (!isExcluded) {
    const token = getAccessToken(request);
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  // Build fetch options
  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // Forward cookies for excluded routes (login/logout)
  if (forwardCookies || isExcluded) {
    fetchOptions.credentials = "include";
  }

  // Add body if provided
  if (body) {
    if (body instanceof FormData) {
      fetchOptions.body = body;
      // Don't set Content-Type for FormData - browser will set with boundary
    } else if (typeof body === "string") {
      // If body is already a string (e.g., JSON string), use it directly
      fetchOptions.body = body;
      // Set Content-Type for string bodies if not already set
      if (!requestHeaders["Content-Type"]) {
        requestHeaders["Content-Type"] = "application/json";
      }
    } else {
      fetchOptions.body = JSON.stringify(body);
      requestHeaders["Content-Type"] = "application/json";
    }
  }

  try {
    const response = await fetch(url, fetchOptions);
    console.log(`API Request: ${method} ${url} - Status: ${response.status}`);

    // Return raw response if requested
    if (raw) {
      return response;
    }

    // Get Set-Cookie header to forward to client
    const setCookieHeader = response.headers.get("set-cookie");

    // Handle different response statuses
    if (response.status === 401) {
      return data(
        { error: "Unauthorized. Please log in again." },
        { status: 401 },
      );
    }

    if (response.status === 403) {
      return data(
        { error: "Forbidden. You don't have permission." },
        { status: 403 },
      );
    }

    if (response.status === 404) {
      return data({ error: "Resource not found." }, { status: 404 });
    }

    if (response.status === 500) {
      return data(
        { error: "Server error. Please try again later." },
        { status: 500 },
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return data(
        {
          error:
            errorData.detail || `Request failed with status ${response.status}`,
        },
        { status: response.status },
      );
    }

    // For successful responses, try to parse JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const responseData = await response.json();

      // Forward Set-Cookie header if present
      const responseInit: ResponseInit = { status: response.status };
      if (setCookieHeader) {
        responseInit.headers = { "Set-Cookie": setCookieHeader };
      }

      return data(responseData, responseInit);
    }

    // Return raw response for non-JSON responses
    const responseInit: ResponseInit = { status: response.status };
    if (setCookieHeader) {
      responseInit.headers = { "Set-Cookie": setCookieHeader };
    }
    return data({}, responseInit);
  } catch (error) {
    // Network error or fetch failure
    const errorMessage =
      error instanceof Error ? error.message : "Network error";
    return data({ error: `Network error: ${errorMessage}` }, { status: 0 });
  }
}
