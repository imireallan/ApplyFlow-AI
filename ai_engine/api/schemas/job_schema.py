from typing import Any, List, Optional

from pydantic import BaseModel


class JobRequest(BaseModel):
    job_description: str
    top_k: int = 5
    cv_id: str


class JobMatch(BaseModel):
    id: str
    content: str
    match_score: float
    reasoning: str
    nudge: str
    highlights: Optional[list[str]] = None
    insight: Optional[str] = None
    missing_skills: Optional[list[str]] = None
    improved_content: Optional[str] = None


class UserProfile(BaseModel):
    summary: str
    skills: List[str]
    experience: List[Any]
    education: List[Any]


class JobResponse(BaseModel):
    status: str
    data: List[JobMatch]
    profile: Optional[UserProfile] = None
