import type { CV, JobMatch, UploadCV } from "./cv";
import type { User, UserProfile } from "./user";

export interface ApiError {
  detail?: string;
  error?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export type UserResponse = User;

export type GetCVsResponse = CV[];

export type UploadCVResponse = UploadCV;

export interface JobResponse {
  match: JobMatch[];
  profile?: UserProfile;
}
