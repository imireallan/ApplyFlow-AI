from abc import ABC, abstractmethod
from typing import Any

from core.application.models.match import MatchSimilarityScore


class VectorStorePort(ABC):

    @abstractmethod
    def query(self, query: str, k: int) -> list[MatchSimilarityScore]:
        pass

    @abstractmethod
    def upsert(self, file_path: str) -> dict[str, Any]:
        pass
