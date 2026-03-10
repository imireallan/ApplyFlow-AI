from typing import Any, List, Optional

from pydantic import BaseModel


class JobRequest(BaseModel):
    job_description: str
    top_k: int = 5


class JobMatch(BaseModel):
    id: str
    content: str
    match_score: float
    reasoning: str
    nudge: str


class UserProfile(BaseModel):
    summary: str
    skills: List[str]
    experience: List[Any]
    education: List[Any]


class JobResponse(BaseModel):
    status: str
    data: List[JobMatch]
    profile: Optional[UserProfile] = None  # Added profile field
