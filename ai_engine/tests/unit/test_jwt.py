"""Tests for core/security/jwt.py"""
from uuid import uuid4

import pytest
from fastapi import HTTPException

from core.security.jwt import (
    TokenPayload,
    create_access_token,
    decode_token,
)


class TestTokenPayload:
    def test_create_payload(self):
        user_id = uuid4()
        payload = TokenPayload(sub=user_id, exp=9999999999)
        assert payload.sub == user_id
        assert payload.exp == 9999999999

    def test_payload_extras(self):
        """TokenPayload allows extra fields via extra='allow'."""
        user_id = uuid4()
        payload = TokenPayload(sub=user_id, exp=9999999999, role="admin")
        assert payload.role == "admin"


class TestCreateAccessToken:
    def test_token_is_string(self):
        user_id = uuid4()
        token = create_access_token({"sub": user_id})
        assert isinstance(token, str)

    def test_token_not_empty(self):
        user_id = uuid4()
        token = create_access_token({"sub": user_id})
        assert len(token) > 0

    def test_token_contains_user_id(self):
        user_id = uuid4()
        token = create_access_token({"sub": user_id})
        payload = decode_token(token)
        assert payload.sub == user_id

    def test_token_expires(self):
        user_id = uuid4()
        token = create_access_token({"sub": user_id})
        payload = decode_token(token)
        assert payload.exp > 0


class TestDecodeToken:
    def test_valid_token(self):
        user_id = uuid4()
        token = create_access_token({"sub": user_id})
        payload = decode_token(token)
        assert payload.sub == user_id

    def test_invalid_token_raises_401(self):
        with pytest.raises(HTTPException) as exc_info:
            decode_token("invalid-token-string")
        assert exc_info.value.status_code == 401

    def test_empty_token_raises_401(self):
        with pytest.raises(HTTPException):
            decode_token("")

    def test_malformed_jwt_raises_401(self):
        with pytest.raises(HTTPException):
            decode_token("not.a.jwt")
