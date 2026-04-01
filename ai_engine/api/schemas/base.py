from datetime import datetime
from uuid import UUID

from pydantic import BaseModel as PydanticBaseModel


class BaseModel(PydanticBaseModel):
    id: UUID
    created_at: datetime | None
    updated_at: datetime | None

    model_config = {"from_attributes": True}
