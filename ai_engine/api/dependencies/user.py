from fastapi import Depends
from sqlalchemy.orm import Session

from core.domain.repositories.user_repository import UserRepository
from core.domain.services.user_service import UserService
from infrastructure.db.repositories.user_repository_sqlalchemy import (
    SQLAlchemyUserRepository,
)
from infrastructure.db.session import get_db


def get_user_repository(session: Session = Depends(get_db)) -> SQLAlchemyUserRepository:
    return SQLAlchemyUserRepository(session)


def get_user_service(
    user_repo: UserRepository = Depends(get_user_repository),
) -> UserService:
    return UserService(user_repo)
