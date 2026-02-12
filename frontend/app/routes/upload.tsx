import { Form, redirect, useNavigation } from "react-router";
import { Upload, Loader2, FileCheck } from "lucide-react";
import type { Route } from "./+types/upload";
import { UploadForm } from "~/components/UploadForm";

const API_URL = `${import.meta.env.VITE_AI_API_URL}/cv/index-cv`;

// Even if it just returns null, it satisfies the router
export async function loader() {
  return null;
}

// Handles the actual file upload
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return { error: "Please select a valid PDF file." };
  }

  // Use a new FormData to send to your FastAPI backend
  const apiData = new FormData();
  apiData.append("file", file);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: apiData,
    });

    if (response.ok) {
      // After successful indexing, redirect to the search page
      return redirect("/search");
    }
    return { error: "Failed to index CV. Check backend logs." };
  } catch (err) {
    return { error: "Network error connecting to AI Engine." };
  }
}

export default function UploadPage({ actionData }: Route.ComponentProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#fcfcfd] p-6">
      <UploadForm error={actionData?.error} />
    </div>
  );
}
