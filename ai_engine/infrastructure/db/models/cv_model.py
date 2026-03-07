from uuid import uuid4, UUID

from sqlalchemy import ForeignKey, String, Text, UUID as PGUUID
from sqlalchemy.orm import MappedColumn, mapped_column, relationship

from .base import BaseORM


class CVORM(BaseORM):
    __tablename__ = "cvs"

    id: MappedColumn[UUID] = mapped_column(
        PGUUID, primary_key=True, default=lambda: uuid4()
    )
    user_id: MappedColumn[UUID] = mapped_column(
        PGUUID, ForeignKey("users.id"), nullable=False, index=True
    )
    file_name: MappedColumn[str | None] = mapped_column(String, nullable=False)
    content: MappedColumn[str] = mapped_column(Text)

    user = relationship("UserORM", back_populates="cvs")
    embeddings = relationship("CVEmbeddingORM", back_populates="cv")
    profiles = relationship("CVProfileORM", back_populates="cv")
