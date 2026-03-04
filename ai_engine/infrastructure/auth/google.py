from fastapi import HTTPException
from google.auth.transport import requests
from google.oauth2 import id_token


def verify_google_token(token: str) -> str:
    try:
        return id_token.verify_oauth2_token(  # type: ignore
            token,
            requests.Request(),
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token")
