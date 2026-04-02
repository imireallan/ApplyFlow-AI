from typing import Any, Optional

from langchain_core.embeddings import Embeddings
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import OpenAIEmbeddings
from pinecone import Pinecone, ServerlessSpec
from pinecone.exceptions import NotFoundException, PineconeException

from api.exception_handlers import VectorStoreError as HTTPVectorStoreError
from core.application.models.match import MatchSimilarityScore
from core.application.ports.vector_store_port import VectorStorePort
from core.config.settings import settings


class PineconeVectorStoreAdapter(VectorStorePort):

    def __init__(self) -> None:
        print("🔥 Initializing vector store ONCE")
        # Initialize embeddings based on provider
        if settings.EMBEDDING_PROVIDER == "huggingface":
            self.embeddings: Embeddings = HuggingFaceEmbeddings(
                model=settings.HUGGINGFACE_EMBEDDING_MODEL,
            )
        else:
            self.embeddings = OpenAIEmbeddings()

        try:
            pc = Pinecone(api_key=settings.PINECONE_API_KEY)

            dimension = 384

            index_name = settings.PINECONE_INDEX

            if index_name not in [i.name for i in pc.list_indexes()]:

                pc.create_index(
                    name=index_name,
                    dimension=dimension,
                    metric="cosine",
                    spec=ServerlessSpec(
                        cloud="aws",
                        region="us-east-1",
                    ),
                )
            self.index: Any = pc.Index(index_name)
        except NotFoundException as e:
            raise HTTPVectorStoreError(
                detail="Vector store index not found. Please try again later.",
                log_message=f"Pinecone index 'applyflow-cv-index' not found: {str(e)}",
            ) from e
        except Exception as e:
            raise HTTPVectorStoreError(
                detail="Failed to connect to vector store. Please try again later.",
                log_message=f"Failed to connect to Pinecone: {str(e)}",
            ) from e

    def upsert(
        self, vector_id: str, content: str, user_id: str, cv_id: str
    ) -> dict[str, Any]:

        try:
            vector = self.embeddings.embed_query(content)

            self.index.upsert(
                vectors=[
                    {
                        "id": vector_id,
                        "values": vector,
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

        except PineconeException as e:
            # Handle rate limiting (429) and other Pinecone-specific errors
            error_code = getattr(e, "code", None)
            error_str = str(e)
            if error_code == "ratelimit" or "429" in error_str:
                raise HTTPVectorStoreError(
                    detail="Rate limit exceeded. Please try again later.",
                    log_message=f"Pinecone rate limit exceeded: {error_str}",
                ) from e
            # Handle dimension mismatch errors
            if "dimension" in error_str.lower():
                raise HTTPVectorStoreError(
                    detail="Vector dimension mismatch. Please contact support to recreate the Pinecone index with the correct dimension.",
                    log_message=f"Pinecone dimension mismatch: {error_str}",
                ) from e
            # Handle not found errors
            if isinstance(e, NotFoundException):
                raise HTTPVectorStoreError(
                    detail="Vector store index not found. Please try again later.",
                    log_message=f"Pinecone index not found during upsert: {error_str}",
                ) from e
            raise HTTPVectorStoreError(
                detail="Vector store operation failed. Please try again later.",
                log_message=f"Pinecone error: {error_str}",
            ) from e
        except Exception as e:
            error_str = str(e)
            # Check for OpenAI quota errors (429)
            if "429" in error_str and "quota" in error_str.lower():
                raise HTTPVectorStoreError(
                    detail="Embedding service quota exceeded. Please check your plan and billing details.",
                    log_message=f"OpenAI quota exceeded: {error_str}",
                ) from e
            raise HTTPVectorStoreError(
                detail="Failed to save CV data. Please try again later.",
                log_message=f"Failed to upsert vector: {error_str}",
            ) from e

    def query(
        self,
        query: str,
        user_id: str,
        k: int,
        cv_id: Optional[str] = None,
    ) -> list[MatchSimilarityScore]:

        try:
            vector = self.embeddings.embed_query(query)

            query_args: dict[str, Any] = {
                "vector": vector,
                "top_k": k,
                "namespace": user_id,
                "include_metadata": True,
            }

            if cv_id:
                query_args["filter"] = {"cv_id": {"$eq": cv_id}}

            result = self.index.query(**query_args)

            matches: list[MatchSimilarityScore] = []

            for match in result.matches:
                matches.append(
                    MatchSimilarityScore(
                        id=match.id,
                        content=match.metadata.get("content", ""),
                        match_score=match.score,
                        metadata=match.metadata,
                    )
                )

            return matches

        except PineconeException as e:
            error_code = getattr(e, "code", None)
            if error_code == "ratelimit" or "429" in str(e):
                raise HTTPVectorStoreError(
                    detail="Rate limit exceeded. Please try again later.",
                    log_message=f"Pinecone rate limit exceeded: {str(e)}",
                ) from e
            raise HTTPVectorStoreError(
                detail="Vector store query failed. Please try again later.",
                log_message=f"Pinecone query error: {str(e)}",
            ) from e
        except Exception as e:
            error_str = str(e)
            # Check for OpenAI quota errors (429)
            if "429" in error_str and "quota" in error_str.lower():
                raise HTTPVectorStoreError(
                    detail="Embedding service quota exceeded. Please check your plan and billing details.",
                    log_message=f"OpenAI quota exceeded: {error_str}",
                ) from e
            raise HTTPVectorStoreError(
                detail="Failed to search CVs. Please try again later.",
                log_message=f"Vector query failed: {error_str}",
            ) from e
