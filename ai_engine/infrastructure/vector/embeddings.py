from functools import lru_cache

from core.config.settings import settings
from langchain_core.embeddings import Embeddings


@lru_cache(maxsize=1)
def get_embeddings() -> Embeddings:
    """Build the embedding client once per process."""
    if settings.EMBEDDING_PROVIDER == "openai":
        if not settings.OPENAI_API_KEY:
            raise ValueError(
                "OPENAI_API_KEY is required when EMBEDDING_PROVIDER=openai"
            )
        from langchain_openai import OpenAIEmbeddings

        return OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY)

    from langchain_community.embeddings.fastembed import FastEmbedEmbeddings

    return FastEmbedEmbeddings(model_name=settings.EMBEDDING_MODEL)
