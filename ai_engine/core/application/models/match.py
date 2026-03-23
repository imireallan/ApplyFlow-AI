from typing import Any, Optional

from pydantic import BaseModel


class MatchScore(BaseModel):
    match_score: float


class MatchAnalysis(MatchScore):
    reasoning: str
    nudge: str


class Match(MatchScore):
    id: str
    content: str


class MatchAnalysisResult(Match, MatchAnalysis):
    pass


class MatchEnriched(MatchAnalysisResult):
    highlights: Optional[list[str]] = None
    insight: Optional[str] = None
    missing_skills: Optional[list[str]] = None
    improved_content: Optional[str] = None


class MatchSimilarityScore(Match):
    metadata: dict[str, Any]
