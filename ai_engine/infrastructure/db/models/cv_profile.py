from uuid import UUID

from sqlalchemy import JSON
from sqlalchemy import UUID as PGUUID
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import MappedColumn, mapped_column, relationship

from core.database import Base


class CVProfileORM(Base):
    __tablename__ = "cv_profiles"

    id: MappedColumn[UUID] = mapped_column(PGUUID, primary_key=True)
    cv_id: MappedColumn[UUID] = mapped_column(ForeignKey("cvs.id"), nullable=False)

    cv = relationship("CVORM", back_populates="profiles")

    name: MappedColumn[str] = mapped_column(String)
    summary: MappedColumn[str] = mapped_column(Text)
    skills: MappedColumn[str] = mapped_column(JSON)
    experience: MappedColumn[str] = mapped_column(JSON)
    education: MappedColumn[str] = mapped_column(JSON)
