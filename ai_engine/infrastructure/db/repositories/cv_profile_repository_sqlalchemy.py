from uuid import UUID

from core.domain.models.cv_profile import CVProfile
from core.domain.repositories.cv_profile_repository import CVProfileRepository
from infrastructure.db.models.cv_profile import CVProfileORM
from infrastructure.db.repositories.base import BaseRepository


class SQLAlchemyCVProfileRepository(CVProfileRepository, BaseRepository[CVProfileORM]):
    def get_by_id(self, profile_id: UUID) -> CVProfile | None:
        orm = self.session.query(CVProfileORM).get(profile_id)
        if orm is None:
            return None
        return self._to_domain(orm)

    def get_by_cv_id(self, cv_id: UUID) -> CVProfile | None:
        orm = self.session.query(CVProfileORM).filter_by(cv_id=cv_id).first()
        return self._to_domain(orm) if orm else None

    def get_by_user_id(self, user_id: UUID) -> CVProfile | None:
        # Order by updated_at to get the 'Active' profile
        orm = (
            self.session.query(CVProfileORM)
            .filter_by(user_id=user_id)
            .order_by(CVProfileORM.updated_at.desc()) 
            .first()
        )
        return self._to_domain(orm) if orm else None

    def create(self, profile: CVProfile) -> CVProfile:
        orm = self._to_orm(profile)
        self.add(orm)
        self.commit()
        return self._to_domain(orm)

    def update(self, profile: CVProfile) -> CVProfile:
        orm = self._to_orm(profile)
        self.session.merge(orm)
        self.commit()
        return self._to_domain(orm)

    def _to_orm(self, profile: CVProfile) -> CVProfileORM:
        return CVProfileORM(
            id=profile.id,
            cv_id=profile.cv_id,
            user_id=profile.user_id,
            name=profile.name,
            summary=profile.summary,
            skills=profile.skills,
            experience=profile.experience,
            education=profile.education,
        )

    def _to_domain(self, orm: CVProfileORM) -> CVProfile:
        return CVProfile(
            id=orm.id,
            cv_id=orm.cv_id,
            user_id=orm.user_id,
            name=orm.name,
            summary=orm.summary,
            skills=orm.skills,
            experience=orm.experience,
            education=orm.education,
            created_at=orm.created_at,
            updated_at=orm.updated_at,
        )
