import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import cv_routes, agent_routes, auth_routes

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
    allow_origins=["http://localhost:5173", "http://applyflow-alb-1525855681.us-east-1.elb.amazonaws.com", "https://d672-41-90-176-136.ngrok-free.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(
    auth_routes.router, 
    prefix="/auth",
    tags=["Auth"]
)
app.include_router(
    agent_routes.router, 
    prefix="/agent",
    tags=["Agent Operations"]
)
app.include_router(
    cv_routes.router, 
    prefix="/cv",
    tags=["CV Operations"] 
)

@app.get("/")
def read_root():
    return {"status": "AI Engine Online"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}