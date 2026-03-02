from typing import Any, cast

from fastapi import APIRouter, Depends, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session

from core.config.settings import settings
from core.domain.models.user import User
from core.domain.services.user_service import UserService
from core.security.dependencies import CurrentUser
from core.security.jwt import create_access_token
from infrastructure.auth.google import verify_google_token
from infrastructure.db.repositories.user_repository_sqlalchemy import (
    SQLAlchemyUserRepository,
)
from infrastructure.db.session import get_db

router = APIRouter()


class GoogleLoginRequest(BaseModel):
    id_token: str


class GoogleUserInfo(BaseModel):
    sub: str
    email: str
    name: str | None = None
    given_name: str | None = None
    family_name: str | None = None
    picture: str | None = None

    class Config:
        extra = "ignore"  # Ignore extra fields from Google


@router.post("/google")
def login_google(
    payload: GoogleLoginRequest,
    response: Response,
    db: Session = Depends(get_db),
) -> dict[str, str]:
    raw_data = verify_google_token(payload.id_token)

    id_info_dict = cast(dict[str, Any], raw_data)

    id_info = GoogleUserInfo.model_validate(id_info_dict)

    repo = SQLAlchemyUserRepository(db)
    service = UserService(repo, db)

    user = service.get_or_create_google_user(
        google_id=id_info.sub,
        email=id_info.email,
        full_name=id_info.name,
        first_name=id_info.given_name,
        last_name=id_info.family_name,
        picture_url=id_info.picture,
    )

    token = create_access_token({"sub": str(user.id)})

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=settings.SECURE_COOKIE,
        samesite="lax",
    )

    return {"message": "Login successful"}


@router.get("/me")
def get_me(current_user: CurrentUser) -> User:
    return current_user


@router.post("/logout")
def logout(response: Response) -> dict[str, str]:
    response.delete_cookie("access_token")
    return {"message": "Logged out"}
