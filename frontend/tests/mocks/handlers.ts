import { http, HttpResponse } from "msw";

// Mock API endpoints used in upload flow
export const handlers = [
  http.post("*/cv/index-cv", async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get("file");

    console.log({ file });

    if (!file || !file.name.endsWith(".pdf")) {
      return new HttpResponse(
        JSON.stringify({ detail: "Please select a valid PDF file." }),
        { status: 400 },
      );
    }

    return HttpResponse.json({
      data: { cv_id: "mock-cv-123" },
    });
  }),

  http.post("*/cv/:cvId/profile", () => {
    return HttpResponse.json({
      data: { profile: "mock-profile" },
    });
  }),
];
