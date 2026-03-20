from abc import ABC, abstractmethod
from uuid import UUID

from ..models.cv_profile import CVProfile


class CVProfileRepository(ABC):
    @abstractmethod
    def get_by_id(self, profile_id: UUID) -> CVProfile | None:
        pass

    @abstractmethod
    def create(self, profile: CVProfile) -> CVProfile:
        pass

    @abstractmethod
    def get_by_cv_id(self, cv_id: UUID) -> CVProfile | None:
        pass
    
    @abstractmethod
    def get_by_user_id(self, user_id: UUID) -> CVProfile | None:
        pass

    @abstractmethod
    def update(self, profile: CVProfile) -> CVProfile:
        pass
