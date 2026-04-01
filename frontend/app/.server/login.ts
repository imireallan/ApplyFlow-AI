import { data } from "react-router";
import { formatApiError } from "~/helpers/apiError";
import type { LoginResponse } from "~/types/api";
import { apiRequestHandler } from "./apiRequestHandler";
import { createTokenSession } from "./sessions";

export async function login(
  request: Request,
  credential: FormDataEntryValue | null,
  redirectTo: string,
) {
  if (!credential || typeof credential !== "string") {
    return data(
      {
        error: {
          title: "Internal Server Error",
          message: "Google authentication failed.",
        },
      },
      { status: 400 },
    );
  }

  try {
    const res = await apiRequestHandler<LoginResponse>(request, {
      endpoint: "/auth/google",
      method: "POST",
      body: { id_token: credential },
    });

    if (!res.ok) {
      return data(
        {
          error: formatApiError(res.data, "Login failed. Try again."),
        },
        { status: res.status },
      );
    }

    const accessToken = res.data.access_token

    if (!accessToken) {
      return data(
        {
          error: {
            title: "Internal Server Error",
            message: "Login failed. Could not get session token.",
          },
        },
        { status: 500 },
      );
    }

    return await createTokenSession({
      accessToken,
      redirectTo,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return data(
      {
        error: {
          title: "Internal Server Error",
          message: "Server unavailable. Please try again.",
        },
      },
      { status: 500 },
    );
  }
}
