from uuid import UUID

from core.domain.models.cv_embedding import CVEmbedding
from core.domain.repositories.cv_embedding_repository import CVEmbeddingRepository
from infrastructure.db.models.cv_embedding import CVEmbeddingORM
from infrastructure.db.repositories.base import BaseRepository


class SQLAlchemyCVEmbeddingRepository(
    CVEmbeddingRepository, BaseRepository[CVEmbeddingORM]
):

    def create(self, embedding: CVEmbedding) -> CVEmbedding:

        orm = CVEmbeddingORM(
            id=embedding.id,
            cv_id=embedding.cv_id,
            user_id=embedding.user_id,
            chunk_index=embedding.chunk_index,
            content=embedding.content,
            vector_id=embedding.vector_id,
        )

        self.add(orm)
        self.commit()

        return embedding

    def list_by_cv(self, cv_id: UUID) -> list[CVEmbedding]:

        rows = (
            self.session.query(CVEmbeddingORM)
            .filter(CVEmbeddingORM.cv_id == cv_id)
            .all()
        )

        return [
            CVEmbedding(
                id=row.id,
                cv_id=row.cv_id,
                user_id=row.user_id,
                chunk_index=row.chunk_index,
                content=row.content,
                vector_id=row.vector_id,
                created_at=row.created_at,
                updated_at=row.updated_at,
            )
            for row in rows
        ]

    def delete_by_cv(self, cv_id: UUID) -> None:

        (
            self.session.query(CVEmbeddingORM)
            .filter(CVEmbeddingORM.cv_id == cv_id)
            .delete()
        )

        self.session.commit()
