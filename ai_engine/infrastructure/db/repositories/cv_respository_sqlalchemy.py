from uuid import UUID

from core.domain.models.cv import CV
from core.domain.repositories.cv_repository import CVRepository
from infrastructure.db.models.cv_model import CVORM
from infrastructure.db.repositories.base import BaseRepository


class SQLAlchemyCVRepository(CVRepository, BaseRepository[CVORM]):
    def get_by_id(self, cv_id: UUID) -> CV | None:
        orm = self.session.query(CVORM).get(cv_id)
        if orm is None:
            return None
        return self._to_domain(orm)

    def create(self, cv: CV) -> CV:
        orm = self._to_orm(cv)
        self.add(orm)
        self.commit()
        return self._to_domain(orm)

    def _to_orm(self, cv: CV) -> CVORM:
        return CVORM(
            id=cv.id,
            user_id=cv.user_id,
            file_name=cv.file_name,
            content=cv.content,
        )

    def _to_domain(self, orm: CVORM) -> CV:
        return CV(
            id=orm.id,
            user_id=orm.user_id,
            content=orm.content,
            file_name=orm.file_name,
            created_at=orm.created_at,
            updated_at=orm.updated_at,
        )
