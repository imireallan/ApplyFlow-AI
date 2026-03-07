from dataclasses import dataclass
from uuid import UUID

from .base import BaseModel


@dataclass
class CVEmbedding(BaseModel):
    cv_id: UUID
    user_id: UUID
    chunk_index: int
    content: str
    vector_id: str
