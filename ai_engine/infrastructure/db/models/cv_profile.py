from uuid import UUID

from sqlalchemy import JSON
from sqlalchemy import UUID as PGUUID
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import MappedColumn, mapped_column, relationship

from .base import BaseORM


class CVProfileORM(BaseORM):
    __tablename__ = "cv_profiles"

    id: MappedColumn[UUID] = mapped_column(PGUUID, primary_key=True)
    user_id: MappedColumn[UUID] = mapped_column(
        PGUUID, ForeignKey("users.id"), nullable=False
    )

    user = relationship("UserORM", back_populates="profiles")

    cv_id: MappedColumn[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("cvs.id"), nullable=True
    )

    # Relationship to CV (optional - cv_id is nullable)
    cv = relationship("CVORM", back_populates="profiles")

    name: MappedColumn[str] = mapped_column(String)
    summary: MappedColumn[str] = mapped_column(Text)
    skills: MappedColumn[list[str]] = mapped_column(JSON)
    experience: MappedColumn[list[str]] = mapped_column(JSON)
    education: MappedColumn[list[str]] = mapped_column(JSON)
