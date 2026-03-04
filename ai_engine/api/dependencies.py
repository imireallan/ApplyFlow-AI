from fastapi import Depends

from core.application.ports.llm_port import LLMPort
from core.application.ports.vector_store_port import VectorStorePort
from core.application.services.cv_index_service import CVIndexService
from core.application.services.job_application_service import JobApplicationService
from infrastructure.llm.langchain_llm_adapter import LangChainLLMAdapter
from infrastructure.vector.pinecone_vector_store import PineconeVectorStoreAdapter


def get_vector_store() -> VectorStorePort:
    return PineconeVectorStoreAdapter()


def get_llm() -> LLMPort:
    return LangChainLLMAdapter()


def get_cv_index_service(
    vector_store: VectorStorePort = Depends(get_vector_store),
) -> CVIndexService:
    return CVIndexService(vector_store)


def get_job_application_service(
    vector_store: VectorStorePort = Depends(get_vector_store),
) -> JobApplicationService:
    return JobApplicationService(vector_store, get_llm())
