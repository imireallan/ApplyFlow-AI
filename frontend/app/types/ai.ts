export interface AINudgeResponse {
  data: {
    match_score: number;
    reasoning: string;
    nudge: string;
  };
}

export interface CVMatch {
  content: string;
  score: number;
}