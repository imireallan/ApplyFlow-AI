from core.database import Base, engine
from infrastructure.db.models.user_model import (
    UserORM,  # pyright: ignore[reportUnusedImport]
)


def create_tables() -> None:
    Base.metadata.create_all(bind=engine)
