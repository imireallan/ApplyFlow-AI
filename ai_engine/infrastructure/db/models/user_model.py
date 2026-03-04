from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, MappedColumn, mapped_column

from core.database import Base


class UserORM(Base):
    __tablename__ = "users"

    id: MappedColumn[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    google_id: Mapped[str | None] = mapped_column(String, unique=True, nullable=True)
    email: MappedColumn[str] = mapped_column(String, unique=True, nullable=False)
    full_name: MappedColumn[str | None] = mapped_column(String)
    first_name: MappedColumn[str | None] = mapped_column(String)
    last_name: MappedColumn[str | None] = mapped_column(String)
    picture_url: MappedColumn[str | None] = mapped_column(String)
    is_active: MappedColumn[bool] = mapped_column(Boolean, default=True)
    created_at: MappedColumn[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: MappedColumn[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
