from uuid import UUID

from core.domain.models.cv import CV
from core.domain.repositories.cv_repository import CVRepository


class CVQueryService:
    def __init__(self, cv_repository: CVRepository) -> None:
        self.cv_repository = cv_repository

    def list_user_cvs(self, user_id: str) -> list[CV]:
        """List user's CVs for API response"""
        cvs = self.cv_repository.list_by_user(UUID(user_id))
        return [
            CV(
                id=cv.id,
                user_id=cv.user_id,
                file_name=(
                    cv.file_name.split("_", 1)[1]
                    if cv.file_name and "_" in cv.file_name
                    else cv.file_name or ""
                ),
                content=cv.content,
            )
            for cv in cvs
        ]
