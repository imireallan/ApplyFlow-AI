from functools import cached_property, lru_cache
from typing import Literal

from pydantic import AliasChoices, Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Environment
    ENV: str = "development"

    # Database - supports both local (POSTGRES_*) and external/cloud (EXTERNAL_DB_URL).
    # For AWS RDS or another external DB, set EXTERNAL_DB_URL directly.
    # For local development, use POSTGRES_* vars (defaults to localhost).
    EXTERNAL_DB_URL: str | None = None  # Takes precedence over POSTGRES_*
    DB_SSL_MODE: str | None = None
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password123"
    POSTGRES_DB: str = "applyflow_db"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432

    # Pinecone
    PINECONE_INDEX_NAME_DEV: str = "applyflow-dev"
    PINECONE_INDEX_NAME_PROD: str = "applyflow-prod"
    PINECONE_API_KEY: str = "dev-placeholder"
    PINECONE_CLOUD: str = "aws"
    PINECONE_REGION: str = "us-east-1"

    # Embeddings: "fastembed" (local, ONNX, no torch) or "openai".
    # The Pinecone index dimension must match the model. The adapter checks this at startup.
    #   sentence-transformers/all-MiniLM-L6-v2 -> 384
    #   BAAI/bge-small-en-v1.5                 -> 384
    EMBEDDING_PROVIDER: Literal["fastembed", "openai"] = "fastembed"
    EMBEDDING_MODEL: str = Field(
        default="sentence-transformers/all-MiniLM-L6-v2",
        # keeps an existing .env with HUGGINGFACE_EMBEDDING_MODEL working
        validation_alias=AliasChoices("EMBEDDING_MODEL", "HUGGINGFACE_EMBEDDING_MODEL"),
    )
    OPENAI_API_KEY: str | None = None

    # JWT
    JWT_SECRET: str = "dev-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7

    # Cookie
    SECURE_COOKIE: bool = True

    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://applyflow-alb-1525855681.us-east-1.elb.amazonaws.com",
        "https://d672-41-90-176-136.ngrok-free.app",
    ]

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore"
    )

    @field_validator("EMBEDDING_PROVIDER", mode="before")
    @classmethod
    def _legacy_provider(cls, v: str) -> str:
        # "huggingface" used to be the local provider; fastembed replaces it
        return "fastembed" if v == "huggingface" else v

    @model_validator(mode="after")
    def _reject_dev_defaults_in_prod(self) -> "Settings":
        if self.ENV == "production":
            if self.JWT_SECRET == "dev-secret-change-in-production":
                raise ValueError("JWT_SECRET must be set in production")
            if not self.EXTERNAL_DB_URL and self.POSTGRES_PASSWORD == "password123":
                raise ValueError(
                    "Set EXTERNAL_DB_URL or POSTGRES_PASSWORD in production"
                )
        return self

    @cached_property
    def DATABASE_URL(self) -> str:
        url = self.EXTERNAL_DB_URL or (
            f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )
        if self.DB_SSL_MODE:
            sep = "&" if "?" in url else "?"
            url = f"{url}{sep}sslmode={self.DB_SSL_MODE}"
        return url

    @cached_property
    def PINECONE_INDEX(self) -> str:
        index_map = {
            "development": self.PINECONE_INDEX_NAME_DEV,
            "production": self.PINECONE_INDEX_NAME_PROD,
        }
        index_name = index_map.get(self.ENV, self.PINECONE_INDEX_NAME_PROD)
        if not index_name:
            raise ValueError(f"PINECONE_INDEX_NAME_{self.ENV.upper()} not configured")
        return index_name


@lru_cache
def get_settings() -> Settings:
    return Settings()  # pyright: ignore


settings = get_settings()