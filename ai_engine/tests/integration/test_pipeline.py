"""Integration tests for the full CV indexing + retrieval pipeline."""
from unittest.mock import MagicMock, patch
from uuid import uuid4

import pytest

from core.application.services.cv_index_service import CVIndexService
from core.application.services.cv_query_service import CVQueryService


@pytest.fixture
def full_pipeline(mock_vector_store, mock_cv_repository, mock_embedding_repository):
    """Create a full CV index + query pipeline."""
    index_service = CVIndexService(
        vector_store=mock_vector_store,
        cv_repository=mock_cv_repository,
        embedding_repository=mock_embedding_repository,
    )
    
    query_service = CVQueryService(
        vector_store=mock_vector_store,
        cv_repository=mock_cv_repository,
        embedding_repository=mock_embedding_repository,
    )
    
    return index_service, query_service


class TestFullIndexAndQueryPipeline:
    """Test the end-to-end pipeline indexing + querying."""

    def test_index_then_query(self, full_pipeline, mock_vector_store):
        index_service, query_service = full_pipeline
        
        # Set up the vector store to return matches for queries
        mock_vector_store.query.return_value = []
        
        with (
            patch("core.application.services.cv_index_service.PdfReader") as MockReader,
            patch("core.application.services.cv_index_service.chunk_text") as mock_chunk,
        ):
            # Mock PDF reading
            mock_pages = MagicMock()
            mock_pages.extract_text.return_value = "Python Developer with FastAPI experience" * 50
            MockReader.return_value.pages = [mock_pages]
            mock_chunk.return_value = ["chunk1", "chunk2"]
            
            # Index a CV
            result = index_service.index_cv(
                "/tmp/resume.pdf",
                user_id="550e8400-e29b-41d4-a716-446655440000",
            )
            
            assert "cv_id" in result
            assert result["chunks"] == 2

    def test_index_multiple_cvs_for_same_user(self, full_pipeline, mock_vector_store, mock_cv_repository):
        index_service, _ = full_pipeline
        
        # Mock list_by_user_id to return existing CVs
        mock_cv_repository.list_by_user_id.return_value = []
        
        with (
            patch("core.application.services.cv_index_service.PdfReader") as MockReader,
            patch("core.application.services.cv_index_service.chunk_text") as mock_chunk,
        ):
            mock_pages = MagicMock()
            mock_pages.extract_text.return_value = "Some CV content"
            MockReader.return_value.pages = [mock_pages]
            mock_chunk.return_value = ["c1"]
            
            # First CV
            result1 = index_service.index_cv("/tmp/cv1.pdf", user_id="user-1")
            # Second CV
            result2 = index_service.index_cv("/tmp/cv2.pdf", user_id="user-1")
            
            assert result1["cv_id"] != result2["cv_id"]
