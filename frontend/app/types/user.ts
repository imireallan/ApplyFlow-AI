export interface User {
  id: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  picture_url?: string;
}

export interface UserProfile {
  summary: string;
  skills: string[];
  experience: any[];
  education: any[];
}
