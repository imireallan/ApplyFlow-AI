from uuid import UUID, uuid4

from core.application.ports.llm_port import LLMPort
from core.domain.models.cv_profile import CVProfile
from core.domain.repositories.cv_profile_repository import CVProfileRepository
from core.domain.repositories.cv_repository import CVRepository


class CVProfileService:
    def __init__(
        self,
        llm: LLMPort,
        cv_repository: CVRepository,
        profile_repository: CVProfileRepository,
    ) -> None:
        self.llm = llm
        self.cv_repository = cv_repository
        self.profile_repository = profile_repository

    def generate_profile(self, cv_id: str) -> CVProfile:

        cv_id_uuid = UUID(cv_id)

        cv = self.cv_repository.get_by_id(cv_id_uuid)

        if not cv:
            raise ValueError("CV not found")

        # LLM extraction
        extracted = self.llm.extract_cv_profile(cv.content)

        # Domain entity creation
        profile = CVProfile(
            id=uuid4(),
            cv_id=cv_id_uuid,
            name=extracted.name,
            summary=extracted.summary,
            skills=extracted.skills,
            experience=extracted.experience,
            education=extracted.education,
        )

        return self.profile_repository.create(profile)
