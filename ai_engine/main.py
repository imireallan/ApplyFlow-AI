import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from api.exception_handlers import VectorStoreError
from api.routes import auth_routes, cv_routes, job_routes
from core.config.settings import settings
from core.database import engine

# Set up logger
logger = logging.getLogger(__name__)


def check_migration_status() -> bool:
    """
    Check if database migrations are up to date.
    Returns True if migrations are current, False if not.
    Does NOT run migrations - just checks status.
    """
    from alembic.config import Config
    from alembic.script import ScriptDirectory

    alembic_cfg = Config("alembic.ini")
    alembic_cfg.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

    try:
        # Get current database version
        with engine.connect() as conn:
            # Check if alembic_version table exists
            result = conn.execute(
                text(
                    """
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'alembic_version'
                )
            """
                )
            )
            alembic_table_exists = result.scalar()

            if not alembic_table_exists:
                print(
                    "⚠️ Alembic version table not found. "
                    "Run 'alembic upgrade head' to create initial schema."
                )
                return False

            # Get current revision from database
            result = conn.execute(text("SELECT version_num FROM alembic_version"))
            db_revision = result.scalar()

        # Get latest revision from migration scripts
        script = ScriptDirectory.from_config(alembic_cfg)
        head_revision = script.get_current_head()

        if db_revision == head_revision:
            print("✅ Database migrations are up to date")
            return True
        else:
            print(
                f"⚠️ Database migration mismatch! "
                f"Current: {db_revision}, Latest: {head_revision}. "
                f"Run 'alembic upgrade head' to migrate."
            )
            return False

    except Exception as e:
        print(f"⚠️ Could not verify migration status: {e}")
        return False


@asynccontextmanager
async def lifespan(app: FastAPI):  # type: ignore
    print("🚀 Starting ApplyFlow AI Engine")

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        print("✅ Database Connected")
    except Exception as e:
        print("❌ Database Connection Failed:", e)
        raise e

    # Check migration status (but don't run migrations)
    check_migration_status()

    yield

    print("🛑 Shutting down ApplyFlow AI Engine")


app = FastAPI(title="ApplyFlow AI Engine", root_path="/api", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
app.include_router(job_routes.router, prefix="/job", tags=["Job Operations"])
app.include_router(cv_routes.router, prefix="/cv", tags=["CV Operations"])


@app.exception_handler(VectorStoreError)
async def vector_store_exception_handler(request: Request, exc: VectorStoreError):
    """
    Handle VectorStoreError exceptions.
    Logs detailed error to logging tools (e.g., Sentry) but returns
    user-friendly message to frontend.
    """
    logger.error(
        f"VectorStoreError: {exc.log_message}",
        exc_info=True,
        extra={"path": request.url.path, "method": request.method},
    )
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.get("/health")  # noqa: misc
def health_check() -> dict[str, str]:
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "healthy"}
    except Exception:
        return {"status": "unhealthy"}


class LogHealthOnceFilter(logging.Filter):
    def __init__(self) -> None:
        super().__init__()
        self.logged_once = False

    def filter(self, record: logging.LogRecord) -> bool:
        if "/health" in record.getMessage():
            if not self.logged_once:
                self.logged_once = True
                return True
            return False
        return True


logging.getLogger("uvicorn.access").addFilter(LogHealthOnceFilter())
