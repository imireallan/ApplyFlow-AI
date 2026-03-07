from pydantic import EmailStr

from .base import BaseModel


class UserResponse(BaseModel):
    email: EmailStr
    full_name: str | None
    first_name: str | None
    last_name: str | None
    picture_url: str | None
    is_active: bool
