import os
import jwt
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Response, status
from jwt import PyJWTError

SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-key")
SECURE_COOKIE = os.getenv("SECURE_COOKIE", True)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = int(os.getenv("ACCESS_TOKEN_EXPIRE_DAYS", 7))


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


def create_auth_cookie(response:  Response, token: str):
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=SECURE_COOKIE,
        samesite="lax",
        max_age=60 * 60 * 24 * ACCESS_TOKEN_EXPIRE_DAYS,
    )