from typing import Any

from fastapi import APIRouter, Depends

from api.dependencies import get_job_application_service
from core.application.services.job_application_service import JobApplicationService
from models.schema import QueryRequest

router = APIRouter()


@router.post("/process")  # noqa: misc
async def process_job(
    payload: QueryRequest,
    service: JobApplicationService = Depends(get_job_application_service),
) -> dict[str, Any]:
    result = service.process_job_application(
        job_description=payload.job_description,
        top_k=payload.top_k,
    )
    return {"status": "success", "data": result}
