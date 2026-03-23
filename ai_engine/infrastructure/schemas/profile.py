from typing import Any

from pydantic import BaseModel


class ProfileAnalysisResult(BaseModel):
    name: str
    summary: str
    skills: list[str]
    experience: list[dict[str, Any]]
    education: list[dict[str, Any]]