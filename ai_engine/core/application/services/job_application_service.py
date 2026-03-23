import asyncio
from uuid import UUID

from core.application.models.match import MatchEnriched, MatchSimilarityScore
from core.application.ports.llm_port import LLMPort
from core.application.ports.vector_store_port import VectorStorePort
from core.domain.models.cv_profile import CVProfile
from core.domain.repositories.cv_embedding_repository import CVEmbeddingRepository
from core.domain.repositories.cv_profile_repository import CVProfileRepository


class JobApplicationService:
    def __init__(
        self,
        vector_store: VectorStorePort,
        llm: LLMPort,
        profile_repository: CVProfileRepository,
        cv_embedding_repo: CVEmbeddingRepository,
    ):
        self.vector_store = vector_store
        self.llm = llm
        self.profile_repository = profile_repository
        self.cv_embedding_repo = cv_embedding_repo

    def _build_profile_context(self, profile: CVProfile) -> str:
        """Convert profile into structured LLM context."""

        if not profile:
            return ""

        skills = ", ".join(profile.skills) if profile.skills else "None"

        experience = (
            "\n".join(f"- {exp}" for exp in profile.experience)
            if profile.experience
            else "None"
        )

        education = (
            "\n".join(f"- {edu}" for edu in profile.education)
            if profile.education
            else "None"
        )

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

    async def process_job_application(
        self,
        job_description: str,
        top_k: int,
        user_id: str,
        cv_id: str,
    ) -> tuple[list[MatchEnriched], CVProfile | None]:

        cv_id_uuid = UUID(cv_id)

        profile = self.profile_repository.get_by_cv_id(cv_id_uuid)
        profile_context = self._build_profile_context(profile) if profile else ""

        matches = self.vector_store.query(
            query=job_description,
            user_id=user_id,
            k=top_k,
            cv_id=cv_id,
        )

        contexts: list[tuple[MatchSimilarityScore, str]] = []
        for match in matches:
            context = match.content

            if profile_context:
                context = f"""
                {profile_context}

                CV SECTION
                ----------
                {context}
                """

            contexts.append((match, context))

        # 3. Run LLM calls in parallel
        tasks = [
            self.llm.analyze_match(
                context=context,
                job_description=job_description,
            )
            for (_, context) in contexts
        ]

        analyses = await asyncio.gather(*tasks)

        # 4. Merge results
        enriched: list[MatchEnriched] = []

        for (match, _), analysis in zip(contexts, analyses):
            enriched.append(
                MatchEnriched(
                    id=match.id,
                    content=match.content,
                    match_score=analysis.match_score,
                    reasoning=analysis.reasoning,
                    nudge=analysis.nudge,
                    highlights=analysis.highlights,
                    insight=analysis.insight,
                    missing_skills=analysis.missing_skills,
                    improved_content=analysis.improved_content,
                )
            )

        return (enriched, profile)
