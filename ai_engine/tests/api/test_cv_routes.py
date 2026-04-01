"""Tests for api/routes/cv_routes.py"""
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient


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
    from api.routes import cv_routes
    from main import app
    
    app.include_router(cv_routes.router, prefix="/cv", tags=["cv"])
    # Mock the auth dependency
    from core.security.dependencies import get_current_user
    app.dependency_overrides[get_current_user] = lambda: mock_current_user
    return TestClient(app)


class TestListUserCVs:
    def test_list_user_cvs_empty(self, client, mock_cv_repository):
        with patch(
            "core.application.services.cv_query_service.CVQueryService",
        ) as MockService:
            mock_service = MagicMock()
            mock_service.list_user_cvs.return_value = []
            with patch(
                "api.routes.cv_routes.get_cv_query_service",
                return_value=mock_service,
            ):
                response = client.get("/cv/user-cvs")
                assert response.status_code == 200


class TestIndexCV:
    def test_index_cv_non_pdf(self, client):
        """Should reject non-PDF files."""
        file_content = b"not a pdf"
        response = client.post(
            "/cv/index-cv",
            files={"file": ("test.txt", file_content, "text/plain")},
        )
        assert response.status_code == 400

    def test_index_cv_pdf_success(self, client, mock_vector_store, mock_cv_repository, mock_embedding_repository):
        """Should process PDF files successfully."""
        with (
            patch("api.routes.cv_routes.get_cv_index_service") as mock_get_service,
            patch("api.routes.cv_routes.save_temp_file", return_value="/tmp/test.pdf"),
        ):
            mock_service = MagicMock()
            mock_service.index_cv.return_value = {
                "cv_id": "550e8400-e29b-41d4-a716-446655440000",
                "chunks": 3,
            }
            mock_get_service.return_value = mock_service
            
            response = client.post(
                "/cv/index-cv",
                files={"file": ("test.pdf", b"%PDF-1.4 content", "application/pdf")},
            )
            assert response.status_code == 200
            data = response.json()
            assert "cv_id" in data
