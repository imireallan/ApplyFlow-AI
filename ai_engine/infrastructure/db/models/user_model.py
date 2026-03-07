from uuid import UUID, uuid4

from sqlalchemy import Boolean, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import MappedColumn, mapped_column, relationship

from .base import BaseORM


class UserORM(BaseORM):
    __tablename__ = "users"

    id: MappedColumn[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    google_id: MappedColumn[str | None] = mapped_column(
        String, unique=True, nullable=True
    )
    email: MappedColumn[str] = mapped_column(String, unique=True, nullable=False)
    full_name: MappedColumn[str | None] = mapped_column(String)
    first_name: MappedColumn[str | None] = mapped_column(String)
    last_name: MappedColumn[str | None] = mapped_column(String)
    picture_url: MappedColumn[str | None] = mapped_column(String)
    is_active: MappedColumn[bool] = mapped_column(Boolean, default=True)

    cvs = relationship("CVORM", back_populates="user")
