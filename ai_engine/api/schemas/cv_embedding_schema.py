from uuid import UUID

from .base import BaseModel


class CVEmbeddingResponse(BaseModel):
    cv_id: UUID
    chunk_text: str
    embedding: list[float]
