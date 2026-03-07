from abc import ABC, abstractmethod
from uuid import UUID

from core.domain.models.cv_embedding import CVEmbedding


class CVEmbeddingRepository(ABC):

    @abstractmethod
    def create(self, embedding: CVEmbedding) -> CVEmbedding:
        pass

    @abstractmethod
    def list_by_cv(self, cv_id: UUID) -> list[CVEmbedding]:
        pass

    @abstractmethod
    def delete_by_cv(self, cv_id: UUID) -> None:
        pass
