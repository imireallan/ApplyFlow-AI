from fastapi import APIRouter, Depends

from api.dependencies.cv import get_cv_profile_service, get_job_application_service
from api.exception_handlers import VectorStoreError
from api.schemas.job_schema import JobMatch, JobRequest, JobResponse, UserProfile
from core.application.services.cv_profile_service import CVProfileService
from core.application.services.job_application_service import JobApplicationService
from core.security.dependencies import CurrentUser

router = APIRouter()


@router.post("/process", response_model=JobResponse)
async def process_job(
    current_user: CurrentUser,
    payload: JobRequest,
    service: JobApplicationService = Depends(get_job_application_service),
    profile_service: CVProfileService = Depends(get_cv_profile_service),
) -> JobResponse:
    try:
        # Get enriched matches
        matches = service.process_job_application(
            job_description=payload.job_description,
            top_k=payload.top_k,
            user_id=str(current_user.id),
        )

        # Get user's profile
        profile = profile_service.get_profile_by_user_id(str(current_user.id))
        profile_data = None
        if profile:
            profile_data = UserProfile(
                summary=profile.summary,
                skills=profile.skills,
                experience=profile.experience,
                education=profile.education,
            )

        return JobResponse(
            status="success",
            data=[
                JobMatch(
                    id=m.id,
                    content=m.content,
                    match_score=m.match_score,
                    reasoning=m.reasoning,
                    nudge=m.nudge,
                )
                for m in matches
            ],
            profile=profile_data,
        )

    except VectorStoreError as e:
        raise VectorStoreError(detail=e.detail, log_message=e.log_message) from e
    except Exception as e:
        raise VectorStoreError(
            detail="An unexpected error occurred. Please try again later.",
            log_message=f"Unexpected error in process_job: {str(e)}",
        ) from e
