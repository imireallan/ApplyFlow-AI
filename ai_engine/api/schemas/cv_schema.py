from datetime import datetime
from typing import Any

from pydantic import BaseModel


class Cv(BaseModel):
    id: str
    file_name: str
    user_id: str
    created_at: datetime | None = None
    content: str


class CVProfile(BaseModel):
    user_id: str
    name: str
    summary: str
    skills: list[str]
    experience: list[Any]
    education: list[Any]
    cv_id: str | None = None


class CVListResponse(BaseModel):
    data: list[Cv]
    status: str = "success"


class CVResponse(BaseModel):
    data: Cv
    status: str = "success"
class CVProfileCreateResponse(BaseModel):
    data: None
    status: str = "success"


class CvIndex(BaseModel):
    filename: str | None
    chunks_created: int | None
    cv_id: str


class CVIndexResponse(BaseModel):
    data: CvIndex
    status: str = "success"

class CVProfileResponse(BaseModel):
    data: CVProfile | None
    status: str = "success"
