import os
from typing import Any

from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pinecone import Pinecone, ServerlessSpec

from core.application.models.match import MatchSimilarityScore
from core.application.ports.vector_store_port import VectorStorePort
from core.domain.exceptions import VectorStoreError


class PineconeVectorStoreAdapter(VectorStorePort):
    """
    Infrastructure adapter for Pinecone vector storage.
    Handles CV indexing and similarity search.
    """

    def __init__(self) -> None:
        self.index_name = os.getenv("PINECONE_INDEX_NAME", "applyflow-cvs")
        self.api_key = os.getenv("PINECONE_API_KEY")

        if not self.api_key:
            raise VectorStoreError("PINECONE_API_KEY is not set.")

        self.pc = Pinecone(api_key=self.api_key)

        self.spec: ServerlessSpec = ServerlessSpec(
            cloud="aws",
            region="us-east-1",
        )

        # Local embedding model
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

        self._ensure_index_exists()

    def _ensure_index_exists(self) -> None:
        try:
            indexes = self.pc.list_indexes()
            existing_indexes: list[str] = [idx.name for idx in indexes]

            if self.index_name not in existing_indexes:
                self.pc.create_index(
                    name=self.index_name,
                    dimension=384,
                    metric="cosine",
                    spec=self.spec,
                )

        except Exception as e:
            raise VectorStoreError(
                f"Failed to initialize Pinecone index: {str(e)}"
            ) from e

    def upsert(self, file_path: str) -> dict[str, Any]:
        """
        Load PDF, split into chunks, and store embeddings in Pinecone.
        """
        try:
            loader = PyPDFLoader(file_path)
            documents = loader.load()

            splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=100,
            )

            docs = splitter.split_documents(documents)

            PineconeVectorStore.from_documents(
                docs,
                self.embeddings,
                index_name=self.index_name,
            )

            return {
                "status": "success",
                "chunks": len(docs),
            }

        except Exception as e:
            raise VectorStoreError(f"Failed to upsert CV: {str(e)}") from e

    def query(self, query: str, k: int = 3) -> list[MatchSimilarityScore]:
        """
        Perform similarity search against stored CV embeddings.
        """
        try:
            vectorstore = PineconeVectorStore(
                index_name=self.index_name,
                embedding=self.embeddings,
            )

            results: list[tuple[Document, float]] = (
                vectorstore.similarity_search_with_score(query, k=k)
            )

            formatted_results: list[MatchSimilarityScore] = []

            for doc, score in results:
                
                formatted_results.append(
                    MatchSimilarityScore(
                        id=str(doc.id),
                        content=doc.page_content,
                        match_score=round(float(score), 4),
                        metadata=doc.metadata ,
                    )
                )

            return formatted_results

        except Exception as e:
            raise VectorStoreError(f"Vector search failed: {str(e)}") from e
