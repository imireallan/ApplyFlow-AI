from typing import Optional

from pydantic import BaseModel


class MatchAnalysisResult(BaseModel):
    match_score: float
    reasoning: str
    nudge: str
    highlights: Optional[list[str]] = None
    insight: Optional[str] = None
    missing_skills: Optional[list[str]] = None
    improved_content: Optional[str] = None