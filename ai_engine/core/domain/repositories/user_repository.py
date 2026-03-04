from abc import ABC, abstractmethod
from uuid import UUID

from ..models.user import User


class UserRepository(ABC):

    @abstractmethod
    def get_by_id(self, user_id: UUID) -> User | None:
        pass

    @abstractmethod
    def get_by_google_id(self, google_id: str) -> User | None:
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> User | None:
        pass

    @abstractmethod
    def create(self, user: User) -> User:
        pass
