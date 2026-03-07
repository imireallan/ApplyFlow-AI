from fastapi import APIRouter, Depends

from api.dependencies.cv import get_job_application_service
from api.exception_handlers import VectorStoreError
from api.schemas.job_schema import JobRequest, JobResponse
from core.application.services.job_application_service import JobApplicationService
from core.security.dependencies import CurrentUser

router = APIRouter()


@router.post("/process", response_model=JobResponse)  # noqa: misc
async def process_job(
    current_user: CurrentUser,
    payload: JobRequest,
    service: JobApplicationService = Depends(get_job_application_service),
) -> JobResponse:
    try:
        result = service.process_job_application(
            job_description=payload.job_description,
            top_k=payload.top_k,
            user_id=str(current_user.id),
        )
        return JobResponse(status="success", data=result)
    except VectorStoreError as e:
        raise VectorStoreError(detail=e.detail, log_message=e.log_message) from e
    except Exception as e:
        raise VectorStoreError(
            detail="An unexpected error occurred. Please try again later.",
            log_message=f"Unexpected error in process_job: {str(e)}",
        ) from e
