from uuid import UUID
from dataclasses import dataclass

from .base import BaseModel

@dataclass
class CV(BaseModel):
    user_id: UUID
    file_name: str | None
    content: str
