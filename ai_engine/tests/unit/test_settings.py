"""Tests for core/config/settings.py"""

from core.config.settings import Settings


class TestSettings:
    """Test configuration loading and validation."""

    def test_settings_defaults(self):
        settings = Settings(
            PINECONE_INDEX_NAME_DEV="test-dev",
            PINECONE_INDEX_NAME_PROD="test-prod",
            PINECONE_API_KEY="test-key",
            JWT_SECRET="test-secret",
        )
        assert settings.ENV == "development"
        assert settings.POSTGRES_USER == "postgres"
        assert settings.JWT_ALGORITHM == "HS256"
        assert settings.ACCESS_TOKEN_EXPIRE_DAYS == 7

    def test_database_url_external(self):
        settings = Settings(
            EXTERNAL_DB_URL="postgresql+psycopg2://user:pass@host:5432/db",
            PINECONE_INDEX_NAME_DEV="dev",
            PINECONE_INDEX_NAME_PROD="prod",
            PINECONE_API_KEY="key",
            JWT_SECRET="secret",
        )
        assert settings.DATABASE_URL == "postgresql+psycopg2://user:pass@host:5432/db"

    def test_database_url_local(self):
        settings = Settings(
            POSTGRES_USER="testuser",
            POSTGRES_PASSWORD="password123",
            POSTGRES_DB="testdb",
            POSTGRES_HOST="localhost",
            POSTGRES_PORT=5432,
            PINECONE_INDEX_NAME_DEV="dev",
            PINECONE_INDEX_NAME_PROD="prod",
            PINECONE_API_KEY="key",
            JWT_SECRET="secret",
        )
        url = settings.DATABASE_URL
        assert "testuser:password123@localhost:5432/testdb" in url

    def test_pinecone_index_selection_dev(self):
        settings = Settings(
            ENV="development",
            PINECONE_INDEX_NAME_DEV="dev-index",
            PINECONE_INDEX_NAME_PROD="prod-index",
            PINECONE_API_KEY="key",
            JWT_SECRET="secret",
        )
        assert settings.PINECONE_INDEX == "dev-index"

    def test_pinecone_index_selection_prod(self):
        settings = Settings(
            ENV="production",
            PINECONE_INDEX_NAME_DEV="dev-index",
            PINECONE_INDEX_NAME_PROD="prod-index",
            PINECONE_API_KEY="key",
            JWT_SECRET="secret",
        )
        assert settings.PINECONE_INDEX == "prod-index"

    def test_allowed_origins_contains_localhost(self):
        settings = Settings(
            PINECONE_INDEX_NAME_DEV="test-dev",
            PINECONE_INDEX_NAME_PROD="test-prod",
            PINECONE_API_KEY="test-key",
            JWT_SECRET="test-secret",
        )
        assert "http://localhost:5173" in settings.ALLOWED_ORIGINS

    def test_secure_cookie_default(self):
        settings = Settings(
            PINECONE_INDEX_NAME_DEV="test-dev",
            PINECONE_INDEX_NAME_PROD="test-prod",
            PINECONE_API_KEY="test-key",
            JWT_SECRET="test-secret",
        )
        assert settings.SECURE_COOKIE is True

    def test_embedding_provider_default(self):
        settings = Settings(
            PINECONE_INDEX_NAME_DEV="test-dev",
            PINECONE_INDEX_NAME_PROD="test-prod",
            PINECONE_API_KEY="test-key",
            JWT_SECRET="test-secret",
        )
        assert settings.EMBEDDING_PROVIDER == "huggingface"

    def test_embedding_model_default(self):
        settings = Settings(
            PINECONE_INDEX_NAME_DEV="test-dev",
            PINECONE_INDEX_NAME_PROD="test-prod",
            PINECONE_API_KEY="test-key",
            JWT_SECRET="test-secret",
        )
        assert "all-MiniLM-L6-v2" in settings.HUGGINGFACE_EMBEDDING_MODEL
