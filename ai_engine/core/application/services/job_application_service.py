from core.domain.models.cv_profile import CVProfile
from core.application.models.match import MatchAnalysisResult
from core.application.ports.llm_port import LLMPort
from core.application.ports.vector_store_port import VectorStorePort
from core.domain.repositories.cv_profile_repository import CVProfileRepository


class JobApplicationService:
    def __init__(
        self,
        vector_store: VectorStorePort,
        llm: LLMPort,
        profile_repository: CVProfileRepository,
    ):
        self.vector_store = vector_store
        self.llm = llm
        self.profile_repository = profile_repository

    def _build_profile_context(self, profile: CVProfile) -> str:
        """Convert profile into structured LLM context."""

        if not profile:
            return ""

        skills = ", ".join(profile.skills) if profile.skills else "None"

        experience = "\n".join(
            f"- {exp}" for exp in profile.experience
        ) if profile.experience else "None"

        education = "\n".join(
            f"- {edu}" for edu in profile.education
        ) if profile.education else "None"

        return f"""
                CANDIDATE PROFILE CONTEXT
                -------------------------
                Summary:
                {profile.summary}

                Skills:
                {skills}

                Experience:
                {experience}

                Education:
                {education}

                -------------------------
            """

    def process_job_application(
        self,
        job_description: str,
        top_k: int,
        user_id: str,
    ) -> list[MatchAnalysisResult]:

        # Fetch user's CV profile (optional, enriches analysis)
        profile = self.profile_repository.get_by_user_id(user_id)

        matches = self.vector_store.query(
            job_description,
            k=top_k,
            user_id=user_id,
        )

        

        enriched: list[MatchAnalysisResult] = []

        for match in matches:
            # Include profile context if available
            context = match.content
            if profile:
                profile_context = self._build_profile_context(profile)
                context = f"""
                    {profile_context}

                    CV SECTION
                    ----------
                    {context}
                """

            analysis = self.llm.analyze_match(
                context=context,
                job_description=job_description,
            )

            enriched.append(
                MatchAnalysisResult(
                    id=match.id,
                    content=match.content,
                    match_score=analysis.match_score,
                    reasoning=analysis.reasoning,
                    nudge=analysis.nudge,
                )
            )

        return enriched
