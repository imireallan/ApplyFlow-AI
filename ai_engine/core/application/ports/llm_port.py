from abc import ABC, abstractmethod

from core.application.models.match import MatchEnriched
from core.domain.models.cv_profile import CVProfile, ExtractedCVProfile


class LLMPort(ABC):

    @abstractmethod
    def analyze_match(self, context: str, job_description: str) -> MatchEnriched:
        pass

    @abstractmethod
    def extract_cv_profile(self, cv_content: str) -> CVProfile | ExtractedCVProfile:
        pass
