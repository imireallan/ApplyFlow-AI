from uuid import UUID

from sqlalchemy import UUID as PGUUID
from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import MappedColumn, mapped_column, relationship

from core.database import Base


class CVEmbeddingORM(Base):
    __tablename__ = "cv_embeddings"

    id: MappedColumn[UUID] = mapped_column(PGUUID, primary_key=True)
    cv_id: MappedColumn[UUID] = mapped_column(ForeignKey("cvs.id"), nullable=False)

    cv = relationship("CVORM", back_populates="embeddings")

    pinecone_id: MappedColumn[str] = mapped_column(String, nullable=False)
    chunk_index: MappedColumn[int] = mapped_column(Integer)
