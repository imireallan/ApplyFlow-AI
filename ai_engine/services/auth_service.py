from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from core.security import create_access_token
import os

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")


class AuthService:

    def verify_google_token(self, google_id_token: str):
        id_info = id_token.verify_oauth2_token(
            google_id_token,
            google_requests.Request(),
            GOOGLE_CLIENT_ID,
        )

        if id_info["iss"] not in [
            "accounts.google.com",
            "https://accounts.google.com",
        ]:
            raise Exception("Invalid issuer")

        if not id_info.get("email_verified"):
            raise Exception("Email not verified")

        return id_info

    def login_user(self, google_id_token: str):
        id_info = self.verify_google_token(google_id_token)

        user_id = id_info["sub"]
        email = id_info["email"]

        # TODO: Check if user exists in DB
        # If not → create user

        token = create_access_token({
            "sub": user_id,
            "email": email,
        })

        return token, {
            "id": user_id,
            "email": email,
        }