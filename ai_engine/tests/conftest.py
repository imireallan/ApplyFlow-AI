"""Shared test fixtures for ai_engine tests."""

from unittest.mock import AsyncMock, MagicMock
from uuid import UUID, uuid4

import pytest

from core.domain.models.cv import CV


@pytest.fixture
def user_id() -> str:
    return "550e8400-e29b-41d4-a716-446655440000"


@pytest.fixture
def cv_id() -> UUID:
    return uuid4()


@pytest.fixture
def sample_cv(user_id: str, cv_id: UUID) -> CV:
    return CV(
        id=cv_id,
        user_id=UUID(user_id),
        file_name="test_resume.pdf",
        content="John Doe\nSoftware Engineer\nPython, FastAPI, React\n5 years experience",
    )


@pytest.fixture
def sample_job_description() -> str:
    return """Senior Backend Developer

    We are looking for an experienced backend developer with
    strong Python skills and FastAPI experience."""


@pytest.fixture
def mock_vector_store() -> MagicMock:
    store = MagicMock()
    store.upsert.return_value = {"status": "ok", "ids": ["vec-1"]}
    store.query.return_value = []
    return store


@pytest.fixture
def mock_cv_repository() -> MagicMock:
    repo = MagicMock()
    repo.create.return_value = None
    repo.get_by_id.return_value = None
    repo.list_by_user_id.return_value = []
    return repo


@pytest.fixture
def mock_embedding_repository() -> MagicMock:
    repo = MagicMock()
    repo.create.return_value = None
    repo.list_by_cv_id.return_value = []
    return repo


@pytest.fixture
def mock_llm_adapter() -> MagicMock:
    adapter = MagicMock()
    adapter.analyze_match = AsyncMock()
    adapter.extract_cv_profile.return_value = {
        "name": "John Doe",
        "skills": ["Python", "FastAPI"],
        "years_experience": 5,
    }
    return adapter


@pytest.fixture
def mock_cv_profile_repository() -> MagicMock:
    repo = MagicMock()
    repo.create.return_value = None
    repo.get_by_user_id.return_value = None
    return repo
