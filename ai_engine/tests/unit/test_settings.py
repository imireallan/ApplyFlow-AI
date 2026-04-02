"""Tests for core/config/settings.py"""

import pytest
from pydantic_settings import SettingsConfigDict

from core.config.settings import Settings


class IsolatedSettings(Settings):
    """Settings for tests that never reads .env or environment variables."""
    model_config = SettingsConfigDict(
        env_file=None,
        env_prefix="",
        case_sensitive=True,
        extra="ignore",
    )


@pytest.fixture
def test_settings():
    """Factory fixture for creating isolated test settings."""
    def _create(**overrides):
        # Force minimum required kwargs if not provided
        defaults = {
            "PINECONE_INDEX_NAME_DEV": "test-dev",
            "PINECONE_INDEX_NAME_PROD": "test-prod",
            "PINECONE_API_KEY": "test-pinecone-key",
            "JWT_SECRET": "test-jwt-secret",
        }
        defaults.update(overrides)
        return IsolatedSettings(**defaults)
    return _create


class TestSettings:
    """Test configuration loading and validation."""

    def test_settings_defaults(self, test_settings):
        settings = test_settings()
        assert settings.ENV == "development"
        assert settings.POSTGRES_USER == "postgres"
        assert settings.JWT_ALGORITHM == "HS256"
        assert settings.ACCESS_TOKEN_EXPIRE_DAYS == 7

    def test_database_url_external(self, test_settings):
        settings = test_settings(
            EXTERNAL_DB_URL="postgresql+psycopg2://user:pass@host:5432/db"
        )
        assert settings.DATABASE_URL == "postgresql+psycopg2://user:pass@host:5432/db"

    def test_database_url_local(self, test_settings):
        settings = test_settings(
            POSTGRES_USER="testuser",
            POSTGRES_PASSWORD="password123",
            POSTGRES_DB="testdb",
            POSTGRES_HOST="localhost",
            POSTGRES_PORT=5432,
        )
        url = settings.DATABASE_URL
        assert "testuser:password123@localhost:5432/testdb" in url

    def test_pinecone_index_selection_dev(self, test_settings):
        settings = test_settings(
            ENV="development",
            PINECONE_INDEX_NAME_DEV="dev-index",
            PINECONE_INDEX_NAME_PROD="prod-index",
        )
        assert settings.PINECONE_INDEX == "dev-index"

    def test_pinecone_index_selection_prod(self, test_settings):
        settings = test_settings(
            ENV="production",
            PINECONE_INDEX_NAME_DEV="dev-index",
            PINECONE_INDEX_NAME_PROD="prod-index",
        )
        assert settings.PINECONE_INDEX == "prod-index"

    def test_allowed_origins_contains_localhost(self, test_settings):
        settings = test_settings()
        assert "http://localhost:5173" in settings.ALLOWED_ORIGINS

    def test_secure_cookie_default(self, test_settings):
        settings = test_settings()
        assert settings.SECURE_COOKIE is True

    def test_embedding_provider_default(self, test_settings):
        settings = test_settings()
        assert settings.EMBEDDING_PROVIDER == "huggingface"

    def test_embedding_model_default(self, test_settings):
        settings = test_settings()
        assert "all-MiniLM-L6-v2" in settings.HUGGINGFACE_EMBEDDING_MODEL
