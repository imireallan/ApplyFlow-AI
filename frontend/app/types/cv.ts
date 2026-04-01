import type { User } from "./user";

export interface CV {
  id: string;
  user_id: User;
  file_name: string;
  content: string;
  created_at: string | null;
}

export interface UploadCV {
  cv_id: string;
  file_name: string;
  chunks_created: number;
}

export interface JobMatch {
  id: string;
  content: string;
  match_score: number;
  reasoning: string;
  nudge: string;
  highlights?: string[];
  insight: string[];
  missing_skills: string[];
  improved_content: string[];
}
