from dataclasses import dataclass
from typing import Any
from uuid import UUID

from .base import BaseModel


@dataclass
class CVProfile(BaseModel):
    cv_id: UUID
    name: str
    summary: str
    skills: list[str]
    experience: list[Any]
    education: list[Any]

@dataclass
class ExtractedCVProfile:
    name: str
    summary: str
    skills: list[str]
    experience: list[Any]
    education: list[Any]
