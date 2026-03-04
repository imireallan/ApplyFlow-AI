from uuid import UUID

from sqlalchemy.orm import Session

from core.domain.models.user import User
from core.domain.repositories.user_repository import UserRepository
from infrastructure.db.models.user_model import UserORM


class SQLAlchemyUserRepository(UserRepository):
    def __init__(self, session: Session) -> None:
        self.session = session

    def get_by_email(self, email: str) -> User | None:
        orm = self.session.query(UserORM).filter_by(email=email).first()
        if orm is None:
            return None
        return self._to_domain(orm)

    def get_by_google_id(self, google_id: str) -> User | None:
        orm = self.session.query(UserORM).filter_by(google_id=google_id).first()
        if orm is None:
            return None
        return self._to_domain(orm)

    def get_by_id(self, user_id: UUID) -> User | None:
        orm = self.session.query(UserORM).get(user_id)
        if orm is None:
            return None
        return self._to_domain(orm)

    def create(self, user: User) -> User:
        orm = self._to_orm(user)
        self.session.add(orm)
        return self._to_domain(orm)

    def _to_orm(self, user: User) -> UserORM:
        return UserORM(
            id=user.id,
            google_id=user.google_id,
            email=user.email,
            full_name=user.full_name,
            first_name=user.first_name,
            last_name=user.last_name,
            picture_url=user.picture_url,
            is_active=user.is_active,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )

    def _to_domain(self, orm: UserORM) -> User:
        return User(
            id=orm.id,
            google_id=orm.google_id,
            email=orm.email,
            full_name=orm.full_name,
            first_name=orm.first_name,
            last_name=orm.last_name,
            picture_url=orm.picture_url,
            is_active=orm.is_active,
            created_at=orm.created_at,
            updated_at=orm.updated_at,
        )
