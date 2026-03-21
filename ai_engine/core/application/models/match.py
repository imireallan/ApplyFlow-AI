from typing import Any

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
    highlights: list[str]
    insight: str
    missing_skills: list[str]
    improved_content: str


class MatchSimilarityScore(Match):
    metadata: dict[str, Any]
