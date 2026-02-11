from fastapi import APIRouter, HTTPException
from services.agent_service import AgentService
from models.schema import QueryRequest

router = APIRouter()
agent_service = AgentService()

@router.post("/process")
async def process_job(request: QueryRequest):
    try:
        # Returns a dict with score, reasoning, and nudge
        result = agent_service.process_job_application(request.job_description)
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))