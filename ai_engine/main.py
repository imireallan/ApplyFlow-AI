import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from api.routes import auth_routes, cv_routes, job_routes
from core.config.settings import settings
from core.database import engine
from infrastructure.db.create_tables import create_tables


@asynccontextmanager
async def lifespan(app: FastAPI):  # type: ignore
    print("🚀 Starting ApplyFlow AI Engine")
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
            if settings.ENV == "development":
                try:
                    create_tables()
                    print("✅ Database Tables Created")
                except Exception as e:
                    print("❌ Failed to Create Database Tables:", e)
                    raise e
        print("✅ Database Connected")
    except Exception as e:
        print("❌ Database Connection Failed:", e)
        raise e

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
