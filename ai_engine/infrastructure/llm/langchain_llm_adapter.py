import os
from typing import Any

from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI

from core.application.models.match import MatchAnalysis
from core.application.ports.llm_port import LLMPort
from core.domain.exceptions import LLMError
from models.prompts import NUDGE_SYSTEM_PROMPT, NUDGE_USER_PROMPT


class LangChainLLMAdapter(LLMPort):
    """
    Infrastructure adapter for LLM interaction.
    Supports OpenAI and Groq providers via environment variable.
    """

    def __init__(self) -> None:
        self.provider = os.getenv("LLM_PROVIDER", "groq").lower()

        self.llm: BaseChatModel

        if self.provider == "openai":
            self.llm = ChatOpenAI(
                model="gpt-4o-mini",
                temperature=0.7,
            )
        else:
            self.llm = ChatGroq(
                model_name="llama-3.3-70b-versatile",
                temperature=0.7,
            )

        self.prompt = ChatPromptTemplate.from_messages(
            [
                ("system", NUDGE_SYSTEM_PROMPT),
                ("user", NUDGE_USER_PROMPT),
            ]
        )

        self.chain = self.prompt | self.llm | JsonOutputParser()

    def analyze_match(
        self,
        context: str,
        job_description: str,
    ) -> MatchAnalysis:
        """
        Analyze a resume chunk against a job description.
        Returns structured JSON output.
        """
        try:
            response: dict[str, Any] = self.chain.invoke(
                {
                    "context": context,
                    "job_desc": job_description,
                }
            )

            return MatchAnalysis(
                reasoning=response.get("reasoning", ""),
                nudge=response.get("nudge", ""),
                match_score=response.get("match_score", 0.0),
            )

        except Exception as e:
            raise LLMError(f"LLM analysis failed: {str(e)}") from e
