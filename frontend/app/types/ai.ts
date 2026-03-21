export interface AINudgeResponse {
  data: {
    match_score: number;
    reasoning: string;
    nudge: string;
  };
}

export interface CVMatch {
  id: string;
  content: string;
  match_score: number;
  reasoning: string;
  nudge: string;
  highlights?: string[];
  insight?: string;
  missing_skills?: string[];
  improved_content?: string;
}
