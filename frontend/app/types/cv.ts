import type { User } from "./user";

export interface UserCV {
  id: string;
  user_id: User
  file_name: string;
  content: string
  created_at: string | null;
}

export interface CVListResponse {
  status: string;
  data: UserCV[];
}
