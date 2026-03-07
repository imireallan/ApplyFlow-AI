from typing import Any
from uuid import UUID

from .base import BaseModel


class CVProfileResponse(BaseModel):
    cv_id: UUID
    name: str
    summary: str
    skills: list[str] | dict[str, Any]
    experience: list[dict[str, Any]]
    education: list[dict[str, Any]]
