from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from core.domain.models.user import User
from core.security.jwt import decode_token
from infrastructure.db.repositories.user_repository_sqlalchemy import (
    SQLAlchemyUserRepository,
)
from infrastructure.db.session import get_db


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
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
