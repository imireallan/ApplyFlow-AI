import logging
from typing import Any

from api.exception_handlers import VectorStoreError as HTTPVectorStoreError
from core.application.models.match import MatchSimilarityScore
from core.application.ports.vector_store_port import VectorStorePort
from core.config.settings import settings
from langchain_core.embeddings import Embeddings
from pinecone import Pinecone, ServerlessSpec
from pinecone.exceptions import NotFoundException, PineconeException

from .embeddings import get_embeddings

logger = logging.getLogger(__name__)


class PineconeVectorStoreAdapter(VectorStorePort):

    def __init__(self, embeddings: Embeddings | None = None) -> None:
        # Injectable so tests can pass a fake and skip loading a model
        self.embeddings: Embeddings = embeddings or get_embeddings()
        self.index_name = settings.PINECONE_INDEX
        self.index: Any = self._connect()
        logger.info("Vector store ready (index=%s)", self.index_name)

    # ---------- setup ----------

    def _connect(self) -> Any:
        try:
            pc = Pinecone(api_key=settings.PINECONE_API_KEY)
            dimension = len(self.embeddings.embed_query("dimension probe"))

            if pc.has_index(self.index_name):
                existing = pc.describe_index(self.index_name).dimension
                if existing != dimension:
                    raise HTTPVectorStoreError(
                        detail="Vector store is misconfigured. Please contact support.",
                        log_message=(
                            f"Index '{self.index_name}' has dimension {existing} but "
                            f"{settings.EMBEDDING_PROVIDER}/{settings.EMBEDDING_MODEL} "
                            f"produces {dimension}"
                        ),
                    )
            else:
                pc.create_index(
                    name=self.index_name,
                    dimension=dimension,
                    metric="cosine",
                    spec=ServerlessSpec(
                        cloud=settings.PINECONE_CLOUD,
                        region=settings.PINECONE_REGION,
                    ),
                )
            return pc.Index(self.index_name)
        except HTTPVectorStoreError:
            raise
        except NotFoundException as e:
            raise HTTPVectorStoreError(
                detail="Vector store index not found. Please try again later.",
                log_message=f"Pinecone index '{self.index_name}' not found: {e}",
            ) from e
        except Exception as e:
            raise HTTPVectorStoreError(
                detail="Failed to connect to vector store. Please try again later.",
                log_message=f"Failed to connect to Pinecone: {e}",
            ) from e

    # ---------- operations ----------

    def upsert(
        self, vector_id: str, content: str, user_id: str, cv_id: str
    ) -> dict[str, Any]:
        try:
            self.index.upsert(
                vectors=[
                    {
                        "id": vector_id,
                        "values": self.embeddings.embed_query(content),
                        "metadata": {
                            "content": content,
                            "user_id": user_id,
                            "cv_id": cv_id,
                        },
                    }
                ],
                namespace=user_id,
            )
            return {"status": "success"}
        except Exception as e:
            raise self._to_http_error(
                e, fallback="Failed to save CV data. Please try again later."
            ) from e

    def query(
        self,
        query: str,
        user_id: str,
        k: int,
        cv_id: str | None = None,
    ) -> list[MatchSimilarityScore]:
        try:
            query_args: dict[str, Any] = {
                "vector": self.embeddings.embed_query(query),
                "top_k": k,
                "namespace": user_id,
                "include_metadata": True,
            }
            if cv_id:
                query_args["filter"] = {"cv_id": {"$eq": cv_id}}

            result = self.index.query(**query_args)

            return [
                MatchSimilarityScore(
                    id=m.id,
                    content=m.metadata.get("content", ""),
                    match_score=m.score,
                    metadata=m.metadata,
                )
                for m in result.matches
            ]
        except Exception as e:
            raise self._to_http_error(
                e, fallback="Failed to search CVs. Please try again later."
            ) from e

    # ---------- error mapping ----------

    @staticmethod
    def _to_http_error(e: Exception, *, fallback: str) -> HTTPVectorStoreError:
        msg = str(e)
        low = msg.lower()

        if isinstance(e, NotFoundException):
            return HTTPVectorStoreError(
                detail="Vector store index not found. Please try again later.",
                log_message=f"Pinecone index not found: {msg}",
            )
        if "429" in msg or getattr(e, "code", None) == "ratelimit":
            if "quota" in low:  # OpenAI quota exhaustion
                return HTTPVectorStoreError(
                    detail="Embedding service quota exceeded. Please check your plan and billing details.",
                    log_message=f"Embedding quota exceeded: {msg}",
                )
            return HTTPVectorStoreError(
                detail="Rate limit exceeded. Please try again later.",
                log_message=f"Rate limit exceeded: {msg}",
            )
        if isinstance(e, PineconeException):
            if "dimension" in low:
                return HTTPVectorStoreError(
                    detail="Vector dimension mismatch. Please contact support to recreate the Pinecone index with the correct dimension.",
                    log_message=f"Pinecone dimension mismatch: {msg}",
                )
            return HTTPVectorStoreError(
                detail="Vector store operation failed. Please try again later.",
                log_message=f"Pinecone error: {msg}",
            )
        return HTTPVectorStoreError(
            detail=fallback, log_message=f"Vector operation failed: {msg}"
        )
