

from core.application.models.match import MatchAnalysisResult
from core.application.ports.llm_port import LLMPort
from core.application.ports.vector_store_port import VectorStorePort


class JobApplicationService:
    def __init__(
        self,
        vector_store: VectorStorePort,
        llm: LLMPort,
    ):
        self.vector_store = vector_store
        self.llm = llm

    def process_job_application(
        self,
        job_description: str,
        top_k: int,
        user_id: str,
    ) -> list[MatchAnalysisResult]:

        matches = self.vector_store.query(
            job_description,
            k=top_k,
            user_id=user_id,
        )

        enriched: list[MatchAnalysisResult] = []

        for match in matches:
            analysis = self.llm.analyze_match(
                context=match.content,
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
