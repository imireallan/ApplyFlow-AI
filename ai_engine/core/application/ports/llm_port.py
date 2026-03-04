from abc import ABC, abstractmethod

from core.application.models.match import MatchAnalysis


class LLMPort(ABC):

    @abstractmethod
    def analyze_match(self, context: str, job_description: str) -> MatchAnalysis:
        pass
