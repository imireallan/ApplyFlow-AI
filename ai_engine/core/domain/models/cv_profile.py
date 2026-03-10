from dataclasses import dataclass
from typing import Any
from uuid import UUID

from .base import BaseModel


@dataclass
class CVProfile(BaseModel):
    user_id: UUID
    name: str
    summary: str
    skills: list[str]
    experience: list[Any]
    education: list[Any]
    cv_id: UUID | None = None

@dataclass
class ExtractedCVProfile:
    name: str
    summary: str
    skills: list[str]
    experience: list[Any]
    education: list[Any]
