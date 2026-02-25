from fastapi import APIRouter, HTTPException, Request
from routes.auth_routes import get_current_user
from services.agent_service import AgentService
from models.schema import QueryRequest

router = APIRouter()
agent_service = AgentService()

@router.post("/process")
async def process_job(request: Request, payload: QueryRequest):
    get_current_user(request)
    try:
        # Returns a dict with score, reasoning, and nudge
        result = agent_service.process_job_application(payload.job_description, request.top_k)
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))