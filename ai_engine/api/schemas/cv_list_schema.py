from datetime import datetime

from pydantic import BaseModel


class CVListItem(BaseModel):
    id: str
    file_name: str
    user_id: str
    created_at: datetime | None = None
    content: str


class CVListResponse(BaseModel):
    status: str = "success"
    data: list[CVListItem]
