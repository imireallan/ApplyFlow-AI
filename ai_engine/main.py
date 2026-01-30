import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
class LogHealthOnceFilter(logging.Filter):
    def __init__(self):
        super().__init__()
        self.logged_once = False

    def filter(self, record: logging.LogRecord) -> bool:
        is_health = record.getMessage().find("/health") != -1
        
        if is_health:
            if not self.logged_once:
                self.logged_once = True
                return True
            return False
        return True          

logging.getLogger("uvicorn.access").addFilter(LogHealthOnceFilter())

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "AI Engine Online", "message": "Ready for LangChain logic"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}