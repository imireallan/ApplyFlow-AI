import type { UserResponse } from "~/types/api";
import { apiRequestHandler } from "./apiRequestHandler";

export async function getUserHandler(request: Request) {
  const res = await apiRequestHandler<UserResponse>(request, {
    endpoint: "/auth/me",
    method: "GET",
    forwardCookies: true,
  });

  return res
}
