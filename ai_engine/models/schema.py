from pydantic import BaseModel

class GoogleLoginRequest(BaseModel):
    id_token: str

class QueryRequest(BaseModel):
    job_description: str
    top_k: int = 3