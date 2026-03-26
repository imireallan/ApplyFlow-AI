import { apiRequestHandler } from "./apiRequestHandler";
import { destroyTokenSession } from "./sessions";


export async function logout(request: Request) {
  try {
    await apiRequestHandler(request, {
      endpoint: "/auth/logout",
      method: "POST",
      forwardCookies: true,
    });
  } catch (error) {
    console.error("Backend logout failed:", error);
  }

  return destroyTokenSession(request);
}
