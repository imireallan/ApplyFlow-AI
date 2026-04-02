"""Tests for core/application/ports/ - the port interfaces."""

from typing import Any

import pytest

from core.application.models.match import MatchSimilarityScore
from core.application.ports.llm_port import LLMPort
from core.application.ports.vector_store_port import VectorStorePort


class TestVectorStorePort:
    def test_is_abstract(self):
        with pytest.raises(TypeError):
            VectorStorePort()

    def test_query_is_abstract(self):
        class ConcreteStore(VectorStorePort):
            def query(self, query: str, user_id: str, k: int, cv_id: str | None = None) -> list[MatchSimilarityScore]:
                return []

            def upsert(self, vector_id: str, content: str, user_id: str, cv_id: str) -> dict[str, Any]:
                return {"ids": ["test"]}

        store = ConcreteStore()
        result = store.query("test query", "user-123", k=5)
        assert isinstance(result, list)

    def test_upsert_is_abstract(self):
        class ConcreteStore(VectorStorePort):
            def query(self, query: str, user_id: str, k: int, cv_id: str | None = None) -> list[MatchSimilarityScore]:
                return []

            def upsert(self, vector_id: str, content: str, user_id: str, cv_id: str) -> dict[str, Any]:
                return {"ids": [vector_id]}

        store = ConcreteStore()
        result = store.upsert("vec-1", "content", "user-123", "cv-123")
        assert "ids" in result


class TestLLMPort:
    def test_is_abstract(self):
        with pytest.raises(TypeError):
            LLMPort()

    def test_analyze_match_is_abstract(self):
        from core.application.ports.llm_port import LLMPort

        assert hasattr(LLMPort, "analyze_match")
        assert hasattr(LLMPort, "extract_cv_profile")
