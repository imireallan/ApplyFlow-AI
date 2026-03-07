from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from core.domain.models.user import User
from core.security.jwt import decode_token
from infrastructure.db.repositories.user_repository_sqlalchemy import (
    SQLAlchemyUserRepository,
)
from infrastructure.db.session import get_db


def extract_token_from_header(request: Request) -> str | None:
    """Extract JWT token from Authorization header (Bearer token)."""
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None

    # Expecting "Bearer <token>" format
    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None

    return parts[1]


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
    # First try Authorization header, then fall back to cookie for backward compatibility
    token = extract_token_from_header(request)

    if not token:
        # Fallback to cookie for backward compatibility
        token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )

    payload = decode_token(token)
    user_id = payload.sub

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )

    try:
        repo = SQLAlchemyUserRepository(db)
        user = repo.get_by_id(user_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {str(e)}"
        )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User is inactive"
        )

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
