import { redirect } from "react-router";
import { apiRequestHandler } from "~/.server/apiRequestHandler";
import { PageWrapper } from "~/components/PageWrapper";
import { UploadForm } from "~/components/UploadForm";
import type { Route } from "./+types/upload";

// const API_URL = `${import.meta.env.VITE_AI_API_URL}/cv/index-cv`;

export async function loader() {
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return { error: "Please select a valid PDF file." };
  }

  const apiData = new FormData();
  apiData.append("file", file);

  const result = await apiRequestHandler(request, {
    endpoint: "/cv/index-cv",
    method: "POST",
    body: apiData,
  });

  // Check for errors in result
  if (result.data?.error) {
    return { error: result.data.error };
  }

  return redirect("/app/search");
}

// export async function action({ request }: Route.ActionArgs) {
//   const formData = await request.formData();
//   const file = formData.get("file");

//   if (!file || !(file instanceof File)) {
//     return { error: "Please select a valid PDF file." };
//   }

//   const apiData = new FormData();
//   apiData.append("file", file);

//   try {
//     const response = await fetch(API_URL, {
//       method: "POST",
//       body: apiData,
//     });

//     const data = await response.json()

//     if (response.ok) {
//       // After successful indexing, redirect to the search page
//       return redirect("/app/search");
//     }
//     return { error: data.detail };
//   } catch (err) {
//     return { error: "Network error connecting to AI Engine." };
//   }
// }

export default function UploadPage({ actionData }: Route.ComponentProps) {
  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfd] p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Upload Your Resume
          </h1>
          <p className="text-gray-500 mt-2">
            Get started by uploading your resume
          </p>
        </div>
        <UploadForm error={actionData?.error} />
      </div>
    </PageWrapper>
  );
}
