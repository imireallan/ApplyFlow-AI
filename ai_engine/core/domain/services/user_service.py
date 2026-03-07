from uuid import uuid4

from ..models.user import User
from ..repositories.user_repository import UserRepository


class UserService:
    def __init__(self, user_repo: UserRepository) -> None:
        self.user_repo = user_repo

    def get_or_create_google_user(
        self,
        google_id: str,
        email: str,
        full_name: str | None,
        first_name: str | None,
        last_name: str | None,
        picture_url: str | None,
    ) -> User:

        user = self.user_repo.get_by_google_id(google_id)

        if user:
            return user

        new_user = User(
            id=uuid4(),
            google_id=google_id,
            email=email,
            full_name=full_name,
            first_name=first_name,
            last_name=last_name,
            picture_url=picture_url,
            is_active=True,
        )

        return self.user_repo.create(new_user)
