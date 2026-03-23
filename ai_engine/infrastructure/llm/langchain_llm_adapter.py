import os
from typing import Any

from langchain_core.language_models import BaseChatModel
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI

from core.application.models.match import MatchEnriched
from core.application.ports.llm_port import LLMPort
from core.domain.exceptions import LLMError
from core.domain.models.cv_profile import ExtractedCVProfile
from infrastructure.schemas.match import MatchAnalysisResult
from infrastructure.schemas.profile import ProfileAnalysisResult
from models.prompts import (
    CV_PROFILE_SYSTEM_PROMPT,
    CV_PROFILE_USER_PROMPT,
    NUDGE_SYSTEM_PROMPT,
    NUDGE_USER_PROMPT,
)


class LangChainLLMAdapter(LLMPort):
    """
    Infrastructure adapter for LLM interaction.
    Supports OpenAI and Groq providers via environment variable.
    """

    def __init__(self) -> None:
        print("🔥 Initializing LLM ONCE")
        self.provider = os.getenv("LLM_PROVIDER", "groq").lower()

        if self.provider == "openai":
            self.llm: BaseChatModel = ChatOpenAI(
                model="gpt-4o-mini",
                temperature=0,
            )
        else:
            self.llm = ChatGroq(
                model_name="llama-3.3-70b-versatile",
                temperature=0,
            )
        self.match_parser = PydanticOutputParser(pydantic_object=MatchAnalysisResult)
        self.profile_parser = PydanticOutputParser(
            pydantic_object=ProfileAnalysisResult
        )

        self.prompt: Any = ChatPromptTemplate.from_messages(
            [
                ("system", NUDGE_SYSTEM_PROMPT),
                ("user", NUDGE_USER_PROMPT),
            ]
        ).partial(format_instructions=self.match_parser.get_format_instructions())

        self.chain: Any = self.prompt | self.llm | self.match_parser

        self.cv_profile_prompt: Any = ChatPromptTemplate.from_messages(
            [
                ("system", CV_PROFILE_SYSTEM_PROMPT),
                ("user", CV_PROFILE_USER_PROMPT),
            ]
        ).partial(format_instructions=self.profile_parser.get_format_instructions())

        self.cv_profile_chain: Any = (
            self.cv_profile_prompt | self.llm | self.profile_parser
        )

    async def analyze_match(
        self,
        context: str,
        job_description: str,
    ) -> MatchEnriched:
        """
        Analyze a resume chunk against a job description.
        Returns structured JSON output.
        """
        try:
            result: MatchAnalysisResult = await self.chain.ainvoke(
                {
                    "context": context,
                    "job_desc": job_description,
                }
            )

            return MatchEnriched(
                id="",
                content="",
                reasoning=result.reasoning,
                nudge=result.nudge,
                match_score=result.match_score,
                highlights=result.highlights,
                insight=result.insight,
                missing_skills=result.missing_skills,
                improved_content=result.improved_content,
            )

        except Exception as e:
            raise LLMError(f"LLM analysis failed: {str(e)}") from e

    def extract_cv_profile(self, cv_content: str) -> ExtractedCVProfile:
        try:
            result: ProfileAnalysisResult = self.cv_profile_chain.invoke(
                {
                    "cv_text": cv_content,
                }
            )

            return ExtractedCVProfile(
                name=result.name,
                summary=result.summary,
                skills=result.skills,
                experience=result.experience,
                education=result.education,
            )

        except Exception as e:
            raise LLMError(f"CV profile extraction failed: {str(e)}") from e
