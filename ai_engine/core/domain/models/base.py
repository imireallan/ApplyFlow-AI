from datetime import datetime
from uuid import UUID

from pydantic import BaseModel as PyBaseModel


class BaseModel(PyBaseModel):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
