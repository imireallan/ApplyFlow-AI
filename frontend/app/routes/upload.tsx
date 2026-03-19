import { redirect } from "react-router";
// Request type inferred from Remix
import { apiRequestHandler } from "~/.server/apiRequestHandler";
import { PageWrapper } from "~/components/PageWrapper";
import { UploadForm } from "~/components/UploadForm";

interface ActionArgs {
  request: Request;
}

interface ComponentProps {
  actionData?: {
    error?: string;
  };
}

export async function loader() {
  return null;
}

export async function action({ request }: ActionArgs) {
  const url = new URL(request.url);

  const redirectTo = url.searchParams.get("redirectTo")?.trim();
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return { error: "Please select a valid PDF file." };
  }

  const apiData = new FormData();
  apiData.append("file", file);

  // Step 1: Upload CV and index
  const indexResult = (await apiRequestHandler(request, {
    endpoint: "/cv/index-cv",
    method: "POST",
    body: apiData,
  })) as any;

  if (indexResult instanceof Response || (indexResult as any).data?.error) {
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
  const profileResult = (await apiRequestHandler(request, {
    endpoint: `/cv/${cvId}/profile`,
    method: "POST",
  })) as any;

  if (profileResult instanceof Response || (profileResult as any).data?.error) {
    const error =
      indexResult instanceof Response
        ? await indexResult.json()
        : profileResult.data.error;
    return { error };
  }

  return redirect(redirectTo || `/app/search?cv_id=${cvId}`);
}

export default function UploadPage({ actionData }: ComponentProps) {
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
