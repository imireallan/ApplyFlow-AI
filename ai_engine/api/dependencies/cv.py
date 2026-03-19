from fastapi import Depends
from sqlalchemy.orm import Session

from core.application.ports.llm_port import LLMPort
from core.application.ports.vector_store_port import VectorStorePort
from core.application.services.cv_index_service import CVIndexService
from core.application.services.cv_profile_service import CVProfileService
from core.application.services.cv_query_service import CVQueryService
from core.application.services.job_application_service import JobApplicationService
from core.container import container
from core.domain.repositories.cv_embedding_repository import CVEmbeddingRepository
from core.domain.repositories.cv_profile_repository import CVProfileRepository
from core.domain.repositories.cv_repository import CVRepository
from infrastructure.db.repositories.cv_embedding_repository_sqlalchemy import (
    SQLAlchemyCVEmbeddingRepository,
)
from infrastructure.db.repositories.cv_profile_repository_sqlalchemy import (
    SQLAlchemyCVProfileRepository,
)
from infrastructure.db.repositories.cv_respository_sqlalchemy import (
    SQLAlchemyCVRepository,
)
from infrastructure.db.session import get_db


def get_llm() -> LLMPort:
    if container.llm is None:
        raise RuntimeError("LLM not initialized")
    return container.llm


def get_vector_store() -> VectorStorePort:
    if container.vector_store is None:
        raise RuntimeError("Vector store not initialized")
    return container.vector_store


def get_cv_repository(
    session: Session = Depends(get_db),
) -> CVRepository:
    return SQLAlchemyCVRepository(session)


def get_cv_profile_repository(
    session: Session = Depends(get_db),
) -> CVProfileRepository:
    return SQLAlchemyCVProfileRepository(session)


def get_cv_embedding_repository(
    db: Session = Depends(get_db),
) -> SQLAlchemyCVEmbeddingRepository:
    return SQLAlchemyCVEmbeddingRepository(db)


def get_cv_index_service(
    vector_store: VectorStorePort = Depends(get_vector_store),
    cv_repository: CVRepository = Depends(get_cv_repository),
    cv_embedding_repository: CVEmbeddingRepository = Depends(
        get_cv_embedding_repository
    ),
) -> CVIndexService:
    return CVIndexService(
        vector_store,
        cv_repository,
        cv_embedding_repository,
    )


def get_cv_query_service(
    cv_repository: CVRepository = Depends(get_cv_repository),
) -> CVQueryService:
    return CVQueryService(
        cv_repository,
    )


def get_job_application_service(
    vector_store: VectorStorePort = Depends(get_vector_store),
    llm: LLMPort = Depends(get_llm),
    profile_repository: CVProfileRepository = Depends(get_cv_profile_repository),
    cv_embedding_repo: CVEmbeddingRepository = Depends(get_cv_embedding_repository),
) -> JobApplicationService:
    return JobApplicationService(
        vector_store, llm, profile_repository, cv_embedding_repo
    )


def get_cv_profile_service(
    llm: LLMPort = Depends(get_llm),
    cv_repository: CVRepository = Depends(get_cv_repository),
    profile_repository: CVProfileRepository = Depends(get_cv_profile_repository),
) -> CVProfileService:
    return CVProfileService(
        llm,
        cv_repository,
        profile_repository,
    )
