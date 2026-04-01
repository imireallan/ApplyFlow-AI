"""Tests for api/routes/cv_routes.py."""

from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

from api.dependencies.cv import (
    get_cv_index_service,
    get_cv_query_service,
    get_vector_store,
)
from core.security.dependencies import get_current_user
from main import app


@pytest.fixture
def mock_current_user():
    """Mock the current user dependency."""
    user = MagicMock()
    user.id = "550e8400-e29b-41d4-a716-446655440000"
    user.email = "test@example.com"
    return user


@pytest.fixture
def client(mock_current_user):
    """Create a test client with mocked dependencies."""
    # Override auth so we don't need a real token
    app.dependency_overrides[get_current_user] = lambda: mock_current_user
    # Override vector store so the DI chain can resolve (index-cv depends on it)
    app.dependency_overrides[get_vector_store] = lambda: MagicMock()
    return TestClient(app)


class TestListUserCVs:
    def test_list_user_cvs_empty(self, client):
        mock_service = MagicMock()
        mock_service.list_user_cvs.return_value = []
        app.dependency_overrides[get_cv_query_service] = lambda: mock_service
        try:
            response = client.get("/cv/user-cvs")
            assert response.status_code == 200
        finally:
            app.dependency_overrides.pop(get_cv_query_service, None)


class TestIndexCV:
    def test_index_cv_non_pdf(self, client):
        """Should reject non-PDF files."""
        mock_service = MagicMock()
        app.dependency_overrides[get_cv_index_service] = lambda: mock_service
        try:
            file_content = b"not a pdf"
            response = client.post(
                "/cv/index-cv",
                files={"file": ("test.txt", file_content, "text/plain")},
            )
            assert response.status_code == 400
        finally:
            app.dependency_overrides.pop(get_cv_index_service, None)

    def test_index_cv_pdf_success(self, client):
        """Should process PDF files successfully."""
        mock_service = MagicMock()
        mock_service.index_cv.return_value = {
            "cv_id": "550e8400-e29b-41d4-a716-446655440000",
            "chunks": 3,
        }
        app.dependency_overrides[get_cv_index_service] = lambda: mock_service
        try:
            response = client.post(
                "/cv/index-cv",
                files={"file": ("test.pdf", b"%PDF-1.4 content", "application/pdf")},
            )
            assert response.status_code == 200
            data = response.json()
            assert "cv_id" in data
        finally:
            app.dependency_overrides.pop(get_cv_index_service, None)
