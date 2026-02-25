import { redirect, data, createCookieSessionStorage } from "react-router";

const API_URL = import.meta.env.VITE_AI_API_URL;

const USER_SESSION_KEY = "access_token";
type SessionData = {
  access_token: string;
};

type SessionFlashData = {
  error: string;
};

const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: "__session",
  },
});

export async function createTokenSession({
  request,
  accessToken,
  redirectTo,
}: {
  request: Request;
  accessToken: string;
  redirectTo: string;
}) {
  const session = await getSession(request);

  session.set(USER_SESSION_KEY, accessToken);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // expires in 7 days
      }),
    },
  });
}
export async function destroyTokenSession(request: Request) {
  const session = await getSession(request);

  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserFromRequest(request: Request) {
  const session = await getSession(request);
  const userToken = session.get(USER_SESSION_KEY);

  console.log({ userToken });

  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { cookie: userToken ?? "" },
    credentials: "include",
  });

  if (res.status === 401) {
    return null;
  }

  const payload = await res.json();
  return data(payload.user, { status: 200 });
}

export async function requireUser(request: Request) {
  const user = await getUserFromRequest(request);

  console.log({ user });

  if (!user) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams([["redirectTo", url.pathname]]);

    throw redirect(`/login?${searchParams}`);
  }

  return user;
}

export async function getUserToken(request: Request) {
  const session = await getSession(request);
  const userToken = session.get(USER_SESSION_KEY);
  console.log({ userToken });
  return userToken;
}

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
