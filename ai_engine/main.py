import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import cv_routes, agent_routes

class LogHealthOnceFilter(logging.Filter):
    def __init__(self):
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

app = FastAPI(title="ApplyFlow AI Engine", root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    cv_routes.router, 
    prefix="/cv",
    tags=["CV Operations"] 
)

app.include_router(
    agent_routes.router, 
    prefix="/agent",
    tags=["Agent Operations"]
)

@app.get("/")
def read_root():
    return {"status": "AI Engine Online"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}