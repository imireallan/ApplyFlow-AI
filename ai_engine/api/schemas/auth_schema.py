from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    id_token: str


class LoginResponse(BaseModel):
    message: str
    access_token: str | None = None
    token_type: str = "bearer"


class LogoutResponse(BaseModel):
    message: str


class GoogleUserInfo(BaseModel):
    sub: str
    email: EmailStr
    name: str | None = None
    given_name: str | None = None
    family_name: str | None = None
    picture: str | None = None

    model_config = {"extra": "ignore"}
