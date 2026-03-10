import { useNavigate } from "react-router";
import { apiRequestHandler } from "~/.server/apiRequestHandler";
import { PageWrapper } from "~/components/PageWrapper";
import { UploadForm } from "~/components/UploadForm";
import type { Route } from "./+types/upload";

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

  // Step 1: Upload CV and index
  const indexResult = await apiRequestHandler(request, {
    endpoint: "/cv/index-cv",
    method: "POST",
    body: apiData,
  });

  if (indexResult instanceof Response || indexResult.data?.error) {
    const error =
      indexResult instanceof Response
        ? await indexResult.json()
        : indexResult.data.error;
    return { error };
  }

  const cvId = indexResult.data?.cv_id;
  if (!cvId) {
    return { error: "CV indexing failed: missing CV ID." };
  }

  // Step 2: Generate profile from CV
  const profileResult = await apiRequestHandler(request, {
    endpoint: `/cv/${cvId}/profile`,
    method: "POST",
  });

  if (profileResult instanceof Response || profileResult.data?.error) {
    const error =
      profileResult instanceof Response
        ? await profileResult.json()
        : profileResult.data.error;
    return { error };
  }

  return {
    success: true,
    profile: profileResult.data?.data,
  };
}

export default function UploadPage({ actionData }: Route.ComponentProps) {
  const navigate = useNavigate();

  // Handle successful upload - navigate to search page with profile
  if (actionData?.success && actionData?.profile) {
    // Use setTimeout to allow the actionData to render first
    setTimeout(() => {
      navigate("/app/search", {
        state: { profile: actionData.profile },
      });
    }, 100);
  }

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
        {actionData?.profile && (
          <div className="mt-8 w-full max-w-xl p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-gray-500 uppercase mb-2">
              Profile Summary
            </h3>
            <p className="text-gray-700 mb-2">{actionData.profile.summary}</p>
            <p className="text-gray-700">
              <strong>Skills:</strong> {actionData.profile.skills.join(", ")}
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
