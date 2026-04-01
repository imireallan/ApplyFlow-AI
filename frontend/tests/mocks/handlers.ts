import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("*/auth/me", () =>
    HttpResponse.json({
      id: "test-user-123",
      email: "test@example.com",
      full_name: "Test User",
      first_name: "Test",
      last_name: "User",
      picture_url: "https://example.com/avatar.png",
    })
  ),

  http.post("*/auth/google", async ({ request }) => {
    const body = await request.json();
    const record = body as Record<string, unknown>;
    if (!record?.id_token || !(record.id_token as string).includes("mock-")) {
      return HttpResponse.json({ detail: "Invalid" }, { status: 401 });
    }
    return HttpResponse.json({
      access_token: "mock-access-token",
      token_type: "bearer",
      message: "Login successful",
    });
  }),

  http.get("*/cv/user-cvs", () =>
    HttpResponse.json([
      {
        id: "mock-cv-123",
        file_name: "test-resume.pdf",
        created_at: new Date().toISOString(),
      },
    ])
  ),

  http.post("*/cv/index-cv", async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof File) || !file.name.endsWith(".pdf")) {
      return HttpResponse.json(
        { detail: "Invalid PDF" },
        { status: 400 }
      );
    }
    return HttpResponse.json({ cv_id: "mock-cv-123" });
  }),

  http.post("*/cv/*/profile", () =>
    HttpResponse.json({ profile_id: "mock-profile-456" })
  ),

  http.post("*/job/process", async ({ request }) => {
    const body = await request.json();
    const record = body as Record<string, unknown>;
    if (!record?.cv_id || !record?.job_description) {
      return HttpResponse.json({ detail: "Missing fields" }, { status: 400 });
    }
    return HttpResponse.json({ fit_score: 87, matches: [] });
  }),
];
