from abc import ABC, abstractmethod
from typing import Any, Optional

from core.application.models.match import MatchSimilarityScore


class VectorStorePort(ABC):

    @abstractmethod
    def query(
        self, query: str, user_id: str, k: int, cv_id: Optional[str] = None
    ) -> list[MatchSimilarityScore]:
        pass

    @abstractmethod
    def upsert(
        self, vector_id: str, content: str, user_id: str, cv_id: str
    ) -> dict[str, Any]:
        pass
