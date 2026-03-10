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

    def generate_profile(self, cv_id: str, user_id: str) -> CVProfile:
        cv_id_uuid = UUID(cv_id)
        user_uuid = UUID(user_id)

        cv = self.cv_repository.get_by_id(cv_id_uuid)

        if not cv:
            raise ValueError("CV not found")

        # Extract structured profile using LLM
        extracted = self.llm.extract_cv_profile(cv.content)

        # Check if user already has a profile
        existing = self.profile_repository.get_by_user_id(user_id)

        if existing:
            # Update existing profile
            existing.name = extracted.name
            existing.summary = extracted.summary
            existing.skills = extracted.skills
            existing.experience = extracted.experience
            existing.education = extracted.education
            existing.cv_id = cv_id_uuid

            return self.profile_repository.update(existing)

        # Create new profile
        profile = CVProfile(
            id=uuid4(),
            user_id=user_uuid,
            cv_id=cv_id_uuid,
            name=extracted.name,
            summary=extracted.summary,
            skills=extracted.skills,
            experience=extracted.experience,
            education=extracted.education,
        )

        return self.profile_repository.create(profile)

    def get_profile_by_user_id(self, user_id: str) -> CVProfile | None:
        return self.profile_repository.get_by_user_id(user_id)
