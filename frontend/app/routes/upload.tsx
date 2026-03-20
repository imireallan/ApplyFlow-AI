import { redirect } from "react-router";
// Request type inferred from Remix
import { apiRequestHandler } from "~/.server/apiRequestHandler";
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

  try {
    const apiData = new FormData();
    apiData.append("file", file);

    const indexResponse = (await apiRequestHandler(request, {
      endpoint: "/cv/index-cv",
      method: "POST",
      body: apiData,
    })) as any;

    const getErrorMessage = async (res: any) =>
      res instanceof Response
        ? (await res.json()).detail || "API Error"
        : res?.data?.error;

    if (indexResponse instanceof Response || indexResponse?.data?.error) {
      return { error: await getErrorMessage(indexResponse) };
    }

    const cvId = indexResponse.data?.cv_id;
    if (!cvId) return { error: "CV indexing failed: missing CV ID." };

    const profileResponse = (await apiRequestHandler(request, {
      endpoint: `/cv/${cvId}/profile`,
      method: "POST",
    })) as any;

    if (profileResponse instanceof Response || profileResponse?.data?.error) {
      return { error: await getErrorMessage(profileResponse) };
    }

    const destination = redirectTo || `/app/search?cv_id=${cvId}`;
    return redirect(destination);
  } catch (error) {
    console.error("Action Error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export default function UploadPage({ actionData }: ComponentProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 lg:p-12">
      <div className="text-center max-w-sm w-full">
        <h1 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight">
          Upload Your Resume
        </h1>
        <p className="text-base lg:text-lg text-gray-600 mt-2 leading-relaxed">
          Get started by uploading your resume
        </p>
      </div>
      <div className="w-full max-w-sm">
        <UploadForm error={actionData?.error} />
      </div>
    </div>
  );
}
