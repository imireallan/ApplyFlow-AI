from datetime import datetime, timedelta, timezone
from typing import Any
from uuid import UUID

import jwt
from fastapi import HTTPException
from jwt import PyJWTError
from pydantic import BaseModel, ValidationError

from core.config.settings import settings


class TokenPayload(BaseModel):
    sub: UUID
    exp: int

    class Config:
        extra = "allow"


def create_access_token(data: dict[str, Any]) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.ACCESS_TOKEN_EXPIRE_DAYS
    )
    to_encode["exp"] = int(expire.timestamp())
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> TokenPayload:
    try:
        payload_dict = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return TokenPayload(**payload_dict)
    except (PyJWTError, ValidationError):
        raise HTTPException(status_code=401, detail="Invalid token")
