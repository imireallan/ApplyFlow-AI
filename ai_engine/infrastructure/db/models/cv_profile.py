from uuid import UUID

from sqlalchemy import JSON
from sqlalchemy import UUID as PGUUID
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import MappedColumn, mapped_column, relationship

from .base import BaseORM


class CVProfileORM(BaseORM):
    __tablename__ = "cv_profiles"

    id: MappedColumn[UUID] = mapped_column(PGUUID, primary_key=True)
    cv_id: MappedColumn[UUID] = mapped_column(PGUUID,ForeignKey("cvs.id"), nullable=False)

    cv = relationship("CVORM", back_populates="profiles")

    name: MappedColumn[str] = mapped_column(String)
    summary: MappedColumn[str] = mapped_column(Text)
    skills: MappedColumn[list[str]] = mapped_column(JSON)
    experience: MappedColumn[list[str]] = mapped_column(JSON)
    education: MappedColumn[list[str]] = mapped_column(JSON)
