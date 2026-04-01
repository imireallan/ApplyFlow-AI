import type { ApiError } from "~/types/api";

const API_URL = import.meta.env.VITE_AI_API_URL;
const COOKIE_NAME = "access_token";

const EXCLUDED_ROUTES = ["/auth/google", "/auth/logout"];

function getAccessToken(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

function isExcludedRoute(endpoint: string): boolean {
  return EXCLUDED_ROUTES.some((route) => endpoint.startsWith(route));
}

interface ApiRequestOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: FormData | Record<string, unknown> | string | null;
  headers?: Record<string, string>;
  forwardCookies?: boolean;
}

export interface ApiSuccess<T> {
  status: "success";
  data: T;
}

export type ApiResponse<T> =
  | {
      ok: true;
      status: number;
      data: ApiSuccess<T>;
      headers: Headers;
    }
  | {
      ok: false;
      status: number;
      data: ApiError;
      headers: Headers;
    };

export async function apiRequestHandler<T = any>(
  request: Request,
  {
    endpoint,
    method = "GET",
    body = null,
    headers = {},
    forwardCookies = false,
  }: ApiRequestOptions,
): Promise<
  | {
      ok: true;
      status: number;
      data: T; // ✅ flattened
      headers: Headers;
    }
  | {
      ok: false;
      status: number;
      data: ApiError;
      headers: Headers;
    }
> {
  const url = `${API_URL}${endpoint}`;
  const isExcluded = isExcludedRoute(endpoint);
  const requestHeaders = new Headers(headers);

  if (forwardCookies || isExcluded) {
    const cookie = request.headers.get("Cookie");
    if (cookie) requestHeaders.set("Cookie", cookie);
  }

  if (!isExcluded) {
    const token = getAccessToken(request);
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  let fetchBody: BodyInit | null = null;
  if (body) {
    if (body instanceof FormData) {
      fetchBody = body;
    } else {
      fetchBody = typeof body === "string" ? body : JSON.stringify(body);
      if (!requestHeaders.has("Content-Type")) {
        requestHeaders.set("Content-Type", "application/json");
      }
    }
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: fetchBody,
    });

    let parsedData: any = null;

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      try {
        parsedData = await response.json();
      } catch {
        parsedData = null;
      }
    }

    if (!response.ok) {
      const message =
        parsedData?.detail || parsedData?.error || `Error ${response.status}`;

      return {
        ok: false,
        status: response.status,
        data: { error: message },
        headers: response.headers,
      };
    }

    const normalizedData = parsedData?.data ?? parsedData;

    return {
      ok: true,
      status: response.status,
      data: normalizedData,
      headers: response.headers,
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: {
        error: `Network failure: ${
          error instanceof Error ? error.message : "Unknown"
        }`,
      },
      headers: new Headers(),
    };
  }
}
