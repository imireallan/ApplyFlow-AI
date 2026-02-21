from fastapi import APIRouter, HTTPException
from services.agent_service import AgentService
from models.schema import QueryRequest

router = APIRouter()
agent_service = AgentService()

@router.post("/process")
async def process_job(request: QueryRequest):
    # raise HTTPException(status_code=429, detail="Error code: 429 - {'error': {'message': 'Rate limit reached for model `llama-3.3-70b-versatile` in organization `org_01kgfq643wfq9t19ga7e5cpjs0` service tier `on_demand` on tokens per day (TPD): Limit 100000, Used 99730, Requested 453. Please try again in 2m38.112s. Need more tokens? Upgrade to Dev Tier today at https://console.groq.com/settings/billing', 'type': 'tokens', 'code': 'rate_limit_exceeded'}}")
    try:
        # Returns a dict with score, reasoning, and nudge
        result = agent_service.process_job_application(request.job_description, request.top_k)
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    # raise HTTPException(status_code=500, detail='Server down')