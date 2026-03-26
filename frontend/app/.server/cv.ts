import type { GetCVsResponse, UploadCVResponse } from "~/types/api";
import { apiRequestHandler } from "./apiRequestHandler";

export async function getUserCVsHandler(request: Request) {
  const res = await apiRequestHandler<GetCVsResponse>(request, {
    endpoint: "/cv/user-cvs",
    method: "GET",
    forwardCookies: true,
  });

  return res;
}
export async function createUserCVProfileHandler(
  request: Request,
  cvId: string,
) {
  const res = await apiRequestHandler(request, {
    endpoint: `/cv/${cvId}/profile`,
    method: "POST",
    forwardCookies: true,
  });

  return res;
}

export async function uploadCVHandler(request: Request, body: FormData) {
  const res = await apiRequestHandler<UploadCVResponse>(request, {
    endpoint: "/cv/index-cv",
    method: "POST",
    forwardCookies: true,
    body,
  });

  return res;
}
