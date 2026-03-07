from datetime import datetime

from sqlalchemy import DateTime, func
from sqlalchemy.orm import MappedColumn, mapped_column

from core.database import Base


class BaseORM(Base):
    __abstract__ = True

    created_at: MappedColumn[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    updated_at: MappedColumn[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    deleted_at: MappedColumn[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
