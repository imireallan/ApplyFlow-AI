from pydantic import BaseModel


class QueryRequest(BaseModel):
    job_description: str
    top_k: int = 3
