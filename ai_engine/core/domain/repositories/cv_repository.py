from abc import ABC, abstractmethod
from uuid import UUID

from ..models.cv import CV


class CVRepository(ABC):
    @abstractmethod
    def get_by_id(self, cv_id: UUID) -> CV | None:
        pass

    @abstractmethod
    def create(self, cv: CV) -> CV:
        pass
