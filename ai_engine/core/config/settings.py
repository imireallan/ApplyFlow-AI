from functools import lru_cache, cached_property

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Environment
    ENV: str = "development"

    # Database - Support both local (POSTGRES_*) and external/Cloud (EXTERNAL_DB_URL)
    # For AWS RDS or other external DB, set EXTERNAL_DB_URL directly
    # For local development, use POSTGRES_* vars (defaults to localhost)
    EXTERNAL_DB_URL: str | None = (
        None  # Full connection URL (takes precedence over POSTGRES_*)
    )
    DB_SSL_MODE: str | None = None
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password123"
    POSTGRES_DB: str = "applyflow_db"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432

    PINECONE_INDEX_NAME: str = "applyflow-prod"
    PINECONE_API_KEY: str

    # Embeddings - Use "openai" or "huggingface" (free)
    # Note: If using HuggingFace, ensure your Pinecone index dimension matches:
    # - all-mpnet-base-v2: 768 dimensions
    # - sentence-transformers/all-MiniLM-L6-v2: 384 dimensions
    # For Pinecone, you may need to create an index with the matching dimension
    EMBEDDING_PROVIDER: str = "huggingface"
    OPENAI_API_KEY: str | None = None
    HUGGINGFACE_EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"

    # JWT
    JWT_SECRET: str
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


    @cached_property
    def DATABASE_URL(self) -> str:
        if self.EXTERNAL_DB_URL:
            url = self.EXTERNAL_DB_URL
        else:
            url = (
                f"postgresql+psycopg2://"
                f"{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
                f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
            )

        if self.DB_SSL_MODE:
            url = f"{url}?sslmode={self.DB_SSL_MODE}"

        return url


@lru_cache
def get_settings() -> Settings:
    return Settings()  # pyright: ignore


settings = get_settings()
