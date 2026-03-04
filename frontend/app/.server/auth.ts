import { data } from "react-router";
import { createTokenSession, destroyTokenSession } from "./sessions";

const API_URL = import.meta.env.VITE_AI_API_URL;

export async function login(
  request: Request,
  credential: FormDataEntryValue | null,
) {
  if (!credential || typeof credential !== "string") {
    return data({ error: "Google authentication failed." }, { status: 400 });
  }

  let url = `${API_URL}/auth/google`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: credential }),
    });

    if (!res.ok) {
      const errorMsg = await res.json().catch(() => null);

      return data(
        { error: errorMsg?.message || "Login failed. Try again." },
        { status: 401 },
      );
    }

    const setCookieHeader = res.headers.get("set-cookie") as string;
    // Parse the token value from the Set-Cookie header
    const accessTokenMatch = setCookieHeader.match(/access_token=([^;]+)/);
    const accessToken = accessTokenMatch ? accessTokenMatch[1] : null;

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
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  return destroyTokenSession(request);
}
