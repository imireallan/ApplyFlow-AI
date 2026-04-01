import { http, HttpResponse } from "msw";

// Mock API endpoints used in upload flow
export const handlers = [
  // Mock Remix auth action (login form POST)
  http.post("*/login/action", async ({ request }) => {
    const formData = await request.formData();
    const credential = formData.get("credential");

    if (credential && credential.toString().startsWith("mock-google-token")) {
      return new HttpResponse(null, {
        status: 302,
        headers: {
          "Set-Cookie":
            "auth_session=mock-auth-session-value; Path=/; HttpOnly; Secure; SameSite=Strict",
          "Set-Cookie":
            "__session=mock-session-cookie; Path=/; HttpOnly; Secure; SameSite=Strict",
          Location: "/app",
        },
      });
    }

    return new HttpResponse(JSON.stringify({ error: "Invalid credential" }), {
      status: 400,
    });
  }),

  // Mock loader session check for protected routes
  http.get("*/(app|upload|search)/loader", () => {
    return new HttpResponse(
      JSON.stringify({
        user: { id: "mock-user-1", email: "test@example.com" },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }),

  // Mock user CVs loader for dashboard
  http.get("*/cv/user-cvs", () => {
    return new HttpResponse(
      JSON.stringify({
        data: {
          data: [
            {
              id: "mock-cv-123",
              file_name: "test-resume.pdf",
              created_at: new Date().toISOString(),
            },
          ],
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }),
  // Mock CV index/upload (backend API)
  http.post("*/cv/index-cv", async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || !file.name.endsWith(".pdf")) {
      return new HttpResponse(
        JSON.stringify({ detail: "Please select a valid PDF file." }),
        { status: 400 },
      );
    }

    return new HttpResponse(
      JSON.stringify({
        data: { cv_id: "mock-cv-123" },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }),

  http.post("*/cv/:cvId/profile", () => {
    return new HttpResponse(
      JSON.stringify({
        data: { profile: "mock-profile" },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }),
];
