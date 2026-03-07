from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import UUID, uuid4

from pypdf import PdfReader

from core.application.ports.vector_store_port import VectorStorePort
from core.domain.models.cv import CV
from core.domain.models.cv_embedding import CVEmbedding
from core.domain.repositories.cv_embedding_repository import CVEmbeddingRepository
from core.domain.repositories.cv_repository import CVRepository
from core.utils.text_chunker import chunk_text


class CVIndexService:
    def __init__(
        self,
        vector_store: VectorStorePort,
        cv_repository: CVRepository,
        embedding_repository: CVEmbeddingRepository,
    ) -> None:
        self.vector_store = vector_store
        self.cv_repository = cv_repository
        self.embedding_repository = embedding_repository

    def _extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text content from a PDF file."""
        reader = PdfReader(file_path)
        text_parts: list[str] = []
        for page in reader.pages:
            page_text: str = page.extract_text() or ""
            text_parts.append(page_text)
        return "\n".join(text_parts)

    def index_cv(self, file_path: str, user_id: str) -> dict[str, Any]:
        # Extract text from PDF file
        text = self._extract_text_from_pdf(file_path)

        if not text.strip():
            raise ValueError("No text content could be extracted from the PDF file.")

        cv = CV(
            id=uuid4(),
            user_id=UUID(user_id),
            file_name=Path(file_path).name,
            content=text,
        )

        self.cv_repository.create(cv)

        chunks = chunk_text(cv.content)

        for i, chunk in enumerate(chunks):

            vector_id = f"{cv.id}_{i}"

            self.vector_store.upsert(
                vector_id=vector_id,
                content=chunk,
                user_id=str(cv.user_id),
            )

            embedding = CVEmbedding(
                id=uuid4(),
                cv_id=cv.id,
                user_id=cv.user_id,
                chunk_index=i,
                content=chunk,
                vector_id=vector_id,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )

            self.embedding_repository.create(embedding)

        return {
            "cv_id": cv.id,
            "chunks": len(chunks),
        }
