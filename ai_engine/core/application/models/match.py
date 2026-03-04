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


class MatchSimilarityScore(Match):
    metadata: dict[str, Any]
