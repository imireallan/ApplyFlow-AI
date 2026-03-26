import { logout } from "~/.server/logout";
import type { Route } from "./+types/logout";

export const loader = async ({ request }: Route.ActionArgs) => {
  return await logout(request);
};
