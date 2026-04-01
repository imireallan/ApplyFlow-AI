import { data, redirect, useNavigation, useSubmit } from "react-router";
// Request type inferred from Remix
import { createUserCVProfileHandler, uploadCVHandler } from "~/.server/cv";
import { ErrorComponent } from "~/components/Error";
import { UploadForm } from "~/components/UploadForm";
import { formatApiError } from "~/helpers/apiError";
import type { Route } from "./+types/upload";

interface ComponentProps {
  actionData?: {
    error?: {
      title: string;
      message: string;
    };
  };
}

export async function loader() {
  return null;
}

export async function action({ request }: Route.ActionArgs) {
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

    const indexRes = await uploadCVHandler(request, apiData);

    if (!indexRes.ok) {
      return data(
        {
          error: formatApiError(indexRes.data, "CV indexing failed."),
        },
        { status: indexRes.status },
      );
    }

    const cvId = indexRes.data.cv_id;

    if (!cvId) {
      return data(
        {
          error: {
            title: "Internal Server Error",
            message: "CV indexing failed: missing CV ID.",
          },
        },
        { status: 500 },
      );
    }

    const profileRes = await createUserCVProfileHandler(request, cvId);

    if (!profileRes.ok) {
      return data(
        {
          error: formatApiError(profileRes.data, "Profile generation failed"),
        },
        { status: profileRes.status },
      );
    }

    const destination = redirectTo || `/app/search?cv_id=${cvId}`;
    return redirect(destination);
  } catch (error) {
    console.error("Action Error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export default function UploadPage({ actionData }: ComponentProps) {
  const submit = useSubmit();
  const navigation = useNavigation();
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
        <UploadForm
          error={actionData?.error}
          submit={submit}
          navigation={navigation}
        />
        {actionData?.error && (
          <ErrorComponent
            title={actionData?.error.title}
            message={actionData.error.message}
          />
        )}
      </div>
    </div>
  );
}
