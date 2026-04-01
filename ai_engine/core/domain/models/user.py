from dataclasses import dataclass

from .base import BaseModel


@dataclass
class User(BaseModel):
    google_id: str | None
    email: str
    full_name: str | None
    first_name: str | None
    last_name: str | None
    picture_url: str | None
    is_active: bool

    def is_authenticated(self) -> bool:
        return self.is_active

    @property
    def is_google_user(self) -> bool:
        return self.google_id is not None
