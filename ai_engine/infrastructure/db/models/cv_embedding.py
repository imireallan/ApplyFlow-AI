from uuid import UUID

from sqlalchemy import UUID as PGUUID
from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import MappedColumn, mapped_column, relationship

from .base import BaseORM


class CVEmbeddingORM(BaseORM):
    __tablename__ = "cv_embeddings"

    id: MappedColumn[UUID] = mapped_column(PGUUID, primary_key=True)

    cv_id: MappedColumn[UUID] = mapped_column(
        PGUUID,
        ForeignKey("cvs.id"),
        nullable=False,
        index=True,
    )

    user_id: MappedColumn[UUID] = mapped_column(
        PGUUID,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    chunk_index: MappedColumn[int] = mapped_column(Integer)

    content: MappedColumn[str] = mapped_column(Text)

    vector_id: MappedColumn[str] = mapped_column(String, unique=True)

    cv = relationship("CVORM", back_populates="embeddings")
