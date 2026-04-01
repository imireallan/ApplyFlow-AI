from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    id_token: str


class TokenData(BaseModel):
    access_token: str | None = None
    token_type: str = "bearer"


class LoginResponse(BaseModel):
    status: str = "success"
    data: TokenData


class LogoutResponse(BaseModel):
    status: str = "success"
    data: str


class GoogleUserInfo(BaseModel):
    sub: str
    email: EmailStr
    name: str | None = None
    given_name: str | None = None
    family_name: str | None = None
    picture: str | None = None

    model_config = {"extra": "ignore"}
