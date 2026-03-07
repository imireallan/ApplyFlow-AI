import { data } from "react-router";
import { apiRequestHandler } from "./apiRequestHandler";
import { createTokenSession, destroyTokenSession } from "./sessions";

export async function login(
  request: Request,
  credential: FormDataEntryValue | null,
) {
  if (!credential || typeof credential !== "string") {
    return data({ error: "Google authentication failed." }, { status: 400 });
  }

  try {
    // Use raw: true to get the Response object directly
    const response = (await apiRequestHandler(request, {
      endpoint: "/auth/google",
      method: "POST",
      body: JSON.stringify({ id_token: credential }),
      raw: true,
    })) as Response;

    if (!response.ok) {
      const errorMsg = await response.json().catch(() => null);
      return data(
        { error: errorMsg?.message || "Login failed. Try again." },
        { status: 401 },
      );
    }

    // Get token from response body
    const payload = await response.json();
    const accessToken = payload.access_token;

    if (!accessToken) {
      return data(
        { error: "Login failed. Could not get session token." },
        { status: 500 },
      );
    }

    return await createTokenSession({
      request,
      accessToken,
      redirectTo: "/app",
    });
  } catch (error) {
    console.error(error);
    return data(
      { error: "Server unavailable. Please try again." },
      { status: 500 },
    );
  }
}

export async function logout(request: Request) {
  await apiRequestHandler(request, {
    endpoint: "/auth/logout",
    method: "POST",
  });

  return destroyTokenSession(request);
}
