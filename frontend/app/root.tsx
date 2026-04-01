import { usePostHog } from "@posthog/react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { GoogleOAuthProvider } from "@react-oauth/google";
import type { Route } from "./+types/root";
import {
  getAccessToken,
  getUserFromRequest,
  isTokenExpired,
} from "./.server/sessions";
import "./app.css";
import { GlobalSpinner } from "./components/GlobalSpinner";

import { posthogMiddleware } from "./helpers/posthog-middleware";

export const middleware: Route.MiddlewareFunction[] = [posthogMiddleware];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { pathname } = url;

  const isProtectedRoute = pathname.startsWith("/app");

  let user = null;

  if (isProtectedRoute) {
    const token = getAccessToken(request);

    if (!token || isTokenExpired(token)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);

      const headers = token
        ? {
            "Set-Cookie": `access_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;`,
          }
        : {};

      throw redirect(loginUrl.toString(), { headers });
    }

    user = await getUserFromRequest(request);

    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);

      throw redirect(loginUrl.toString(), {
        headers: {
          "Set-Cookie": `access_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;`,
        },
      });
    }
  }

  return { user };
};

export const meta: Route.MetaFunction = () => [
  { title: "ApplyFlow" },
  {
    name: "description",
    content:
      "ApplyFlow is a platform that helps you find the best fit for your job.",
  },
];

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-900">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <GlobalSpinner />
        <Outlet context={{ user: loaderData.user }} />
      </GoogleOAuthProvider>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const posthog = usePostHog();
  posthog?.captureException(error);
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

export function shouldRevalidate({
  currentUrl,
  nextUrl,
  actionResult,
  defaultShouldRevalidate,
}: any) {
  // 1. If it's an action (like processing a job) that returned a cvId, don't revalidate
  if (actionResult?.cvId) {
    return false;
  }

  // 2. If it's a navigation (like changing the dropdown)
  // Check if the pathname is the same and we only changed the cv_id
  if (currentUrl.pathname === nextUrl.pathname) {
    const currentCvId = currentUrl.searchParams.get("cv_id");
    const nextCvId = nextUrl.searchParams.get("cv_id");

    if (currentCvId !== nextCvId) {
      // The user just picked a different CV.
      // We already have the list of CVs in memory, so don't hit the API again.
      return false;
    }
  }

  return defaultShouldRevalidate;
}
