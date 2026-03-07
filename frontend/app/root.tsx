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

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Get the pathname to check if it's a protected route
  const url = new URL(request.url);
  const pathname = url.pathname;

  // List of protected routes that require authentication
  const protectedRoutes = ["/app"];

  // Check if the user is trying to access a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  let user = null;

  if (isProtectedRoute) {
    // Check if user has a valid token
    const token = getAccessToken(request);

    if (!token) {
      // Redirect to login with return URL
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      throw redirect(loginUrl.toString());
    }

    // Also check if the token is expired
    if (isTokenExpired(token)) {
      // Token expired - clear it and redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      throw redirect(loginUrl.toString(), {
        headers: {
          // Clear the expired cookie
          "Set-Cookie": `access_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;`,
        },
      });
    }

    // Fetch user data for protected routes (cached at root level)
    const userResponse = await getUserFromRequest(request);
    if (userResponse) {
      user = userResponse.data;
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
