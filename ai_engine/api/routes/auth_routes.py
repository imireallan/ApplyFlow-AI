from typing import Any, cast

from fastapi import APIRouter, Depends, Response

from api.dependencies.user import get_user_service
from api.schemas.auth_schema import (
    GoogleUserInfo,
    LoginRequest,
    LoginResponse,
    LogoutResponse,
)
from api.schemas.user_schema import UserResponse
from core.config.settings import settings
from core.domain.models.user import User
from core.domain.services.user_service import UserService
from core.security.dependencies import CurrentUser
from core.security.jwt import create_access_token
from infrastructure.auth.google import verify_google_token

router = APIRouter()


@router.post("/google", response_model=LoginResponse)  # noqa: misc
def login_google(
    payload: LoginRequest,
    response: Response,
    service: UserService = Depends(get_user_service),
) -> LoginResponse:
    raw_data = verify_google_token(payload.id_token)

    id_info_dict = cast(dict[str, Any], raw_data)

    id_info = GoogleUserInfo.model_validate(id_info_dict)

    user = service.get_or_create_google_user(
        google_id=id_info.sub,
        email=id_info.email,
        full_name=id_info.name,
        first_name=id_info.given_name,
        last_name=id_info.family_name,
        picture_url=id_info.picture,
    )

    token = create_access_token({"sub": str(user.id)})

    # Set httpOnly cookie for session security
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=settings.SECURE_COOKIE,
        samesite="lax",
    )

    return LoginResponse(
        message="Login successful",
        access_token=token,
    )


@router.get("/me", response_model=UserResponse)  # noqa: misc
def get_me(current_user: CurrentUser) -> User:
    return current_user


@router.post("/logout", response_model=LogoutResponse)  # noqa: misc
def logout(response: Response) -> LogoutResponse:
    response.delete_cookie("access_token")
    return LogoutResponse(message="Logged out")
