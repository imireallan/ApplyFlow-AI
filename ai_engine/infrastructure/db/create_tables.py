from core.database import Base, engine
from infrastructure.db.models.user_model import (  # pyright: ignore[reportUnusedImport]
    UserORM,
)


def create_tables() -> None:
    Base.metadata.create_all(bind=engine)
