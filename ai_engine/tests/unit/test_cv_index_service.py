"""Tests for core/application/services/cv_index_service.py"""

from unittest.mock import MagicMock, patch
import pytest

from core.application.services.cv_index_service import CVIndexService


class TestCVIndexService:
    """Test the CV indexing service."""

    def test_init(
        self, mock_vector_store, mock_cv_repository, mock_embedding_repository
    ):
        service = CVIndexService(
            vector_store=mock_vector_store,
            cv_repository=mock_cv_repository,
            embedding_repository=mock_embedding_repository,
        )
        assert service.vector_store is mock_vector_store
        assert service.cv_repository is mock_cv_repository
        assert service.embedding_repository is mock_embedding_repository

    def test_extract_text_from_pdf(
        self, mock_vector_store, mock_cv_repository, mock_embedding_repository
    ):
        service = CVIndexService(
            vector_store=mock_vector_store,
            cv_repository=mock_cv_repository,
            embedding_repository=mock_embedding_repository,
        )

        with patch(
            "core.application.services.cv_index_service.PdfReader"
        ) as MockReader:
            mock_pages = MagicMock()
            mock_pages.extract_text.return_value = "Hello World"
            MockReader.return_value.pages = [mock_pages]

            result = service._extract_text_from_pdf("/tmp/test.pdf")
            assert "Hello World" in result

    def test_index_cv_success(
        self, mock_vector_store, mock_cv_repository, mock_embedding_repository
    ):
        service = CVIndexService(
            vector_store=mock_vector_store,
            cv_repository=mock_cv_repository,
            embedding_repository=mock_embedding_repository,
        )

        with (
            patch("core.application.services.cv_index_service.PdfReader") as MockReader,
            patch(
                "core.application.services.cv_index_service.chunk_text"
            ) as mock_chunk,
        ):
            mock_pages = MagicMock()
            mock_pages.extract_text.return_value = "Content from PDF" * 10
            MockReader.return_value.pages = [mock_pages]
            mock_chunk.return_value = ["chunk 1", "chunk 2"]

            result = service.index_cv(
                "/tmp/test.pdf",
                user_id="550e8400-e29b-41d4-a716-446655440000",
            )

            assert "cv_id" in result
            assert "chunks" in result
            assert mock_cv_repository.create.called
            assert mock_vector_store.upsert.call_count == 2

    def test_index_cv_empty_pdf(
        self, mock_vector_store, mock_cv_repository, mock_embedding_repository
    ):
        service = CVIndexService(
            vector_store=mock_vector_store,
            cv_repository=mock_cv_repository,
            embedding_repository=mock_embedding_repository,
        )

        with patch(
            "core.application.services.cv_index_service.PdfReader"
        ) as MockReader:
            mock_pages = MagicMock()
            mock_pages.extract_text.return_value = ""
            MockReader.return_value.pages = [mock_pages]

            with pytest.raises(ValueError, match="No text content"):
                service.index_cv("/tmp/empty.pdf", user_id="test-user")

    def test_index_cv_creates_embeddings(
        self, mock_vector_store, mock_cv_repository, mock_embedding_repository
    ):
        service = CVIndexService(
            vector_store=mock_vector_store,
            cv_repository=mock_cv_repository,
            embedding_repository=mock_embedding_repository,
        )

        with (
            patch("core.application.services.cv_index_service.PdfReader") as MockReader,
            patch(
                "core.application.services.cv_index_service.chunk_text"
            ) as mock_chunk,
        ):
            mock_pages = MagicMock()
            mock_pages.extract_text.return_value = "Test content" * 5
            MockReader.return_value.pages = [mock_pages]
            mock_chunk.return_value = ["c1", "c2", "c3"]

            service.index_cv("/tmp/test.pdf", user_id="test-user")

            assert mock_embedding_repository.create.call_count == 3
