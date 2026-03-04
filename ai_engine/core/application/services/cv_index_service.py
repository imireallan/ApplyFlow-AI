from typing import Any

from core.application.ports.vector_store_port import VectorStorePort


class CVIndexService:
    def __init__(self, vector_store: VectorStorePort) -> None:
        self.vector_store = vector_store

    def index_cv(self, file_path: str) -> dict[str, Any]:
        return self.vector_store.upsert(file_path)
