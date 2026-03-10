from uuid import UUID

from pydantic import BaseModel as PydanticBaseModel

from .base import BaseModel


class CVResponse(BaseModel):
    user_id: UUID
    file_name: str
    content: str


class CVIndexResponse(PydanticBaseModel):
    message: str
    filename: str | None
    chunks_created: int | None
    cv_id: str
