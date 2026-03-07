from typing import Any

from pydantic import BaseModel


class JobRequest(BaseModel):
    job_description: str
    top_k: int = 5


class JobResponse(BaseModel):
    status: str
    data: Any
