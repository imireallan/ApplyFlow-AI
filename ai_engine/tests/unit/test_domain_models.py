"""Tests for core/domain/models/"""

from uuid import UUID, uuid4

from core.domain.models.cv import CV
from core.domain.models.cv_embedding import CVEmbedding
from core.domain.models.cv_profile import CVProfile


class TestCV:
    def test_create_cv(self, sample_cv):
        assert sample_cv.file_name == "test_resume.pdf"
        assert sample_cv.user_id == UUID("550e8400-e29b-41d4-a716-446655440000")

    def test_cv_has_required_fields(self):
        cv = CV(
            id=uuid4(),
            user_id=uuid4(),
            file_name="resume.pdf",
            content="Test content",
        )
        assert cv.id is not None
        assert cv.user_id is not None
        assert cv.content is not None


class TestCVProfile:
    def test_create_profile_minimal(self):
        profile = CVProfile(
            id=uuid4(),
            user_id=uuid4(),
            name="John Doe",
            summary="Profile text",
            skills=[],
            experience=[],
            education=[],
        )
        assert profile.name == "John Doe"

    def test_create_profile_full(self):
        profile = CVProfile(
            id=uuid4(),
            user_id=uuid4(),
            name="John Doe",
            skills=["Python", "FastAPI"],
            summary="Profile text",
            experience=[],
            education=[],
        )
        assert "Python" in profile.skills


class TestCVEmbedding:
    def test_create_embedding(self):
        emb = CVEmbedding(
            id=uuid4(),
            cv_id=uuid4(),
            user_id=uuid4(),
            chunk_index=0,
            content="Test chunk",
            vector_id="vec-123",
        )
        assert emb.chunk_index == 0
        assert emb.vector_id == "vec-123"

    def test_embedding_vector_id_format(self):
        cv_id = uuid4()
        vector_id = f"{cv_id}_0"
        assert "_" in vector_id
        assert str(cv_id) in vector_id
