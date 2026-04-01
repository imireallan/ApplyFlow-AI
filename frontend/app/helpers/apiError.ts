import type { ApiError } from "~/types/api";

export function formatApiError(
  error: ApiError | null | undefined,
  fallbackTitle = "Request Failed",
  fallbackMessage = "Something went wrong. Please try again.",
) {
  const message = error?.detail || error?.error || fallbackMessage;

  if (message === "Not authenticated") {
    return {
      title: "Invalid Request",
      message: "Please login and try again!",
    };
  }

  return {
    title: fallbackTitle,
    message,
  };
}

export function isApiError(data: unknown): data is ApiError {
  return (
    typeof data === "object" &&
    data !== null &&
    ("detail" in data || "error" in data)
  );
}
