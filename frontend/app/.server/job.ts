
import type { JobResponse } from "~/types/api";
import { apiRequestHandler } from "./apiRequestHandler";

export async function processJobHandler(
  request: Request,
  payload: {
    job_description: string;
    cv_id: string;
  },
) {
  const res = await apiRequestHandler<JobResponse>(request, {
    endpoint: "/job/process",
    method: "POST",
    body: { ...payload, top_k: 5 },
  });

  return res;
}
