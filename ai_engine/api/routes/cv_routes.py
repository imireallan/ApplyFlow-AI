from fastapi import APIRouter, Depends, File, UploadFile

from api.dependencies.cv import (
    get_cv_index_service,
    get_cv_profile_service,
    get_cv_query_service,
)
from api.exception_handlers import (
    InvalidFileTypeError,
    MissingCVIdError,
    VectorStoreError,
)
from api.schemas.cv_schema import (
    Cv,
    CvIndex,
    CVIndexResponse,
    CVListResponse,
    CVProfile,
    CVProfileCreateResponse,
    CVProfileResponse,
)
from core.application.services.cv_index_service import CVIndexService
from core.application.services.cv_profile_service import CVProfileService
from core.application.services.cv_query_service import CVQueryService
from core.security.dependencies import CurrentUser
from infrastructure.filestorage.local_file_storage import cleanup_file, save_temp_file

router = APIRouter()


@router.get("/user-cvs", response_model=CVListResponse)
async def list_user_cvs(
    current_user: CurrentUser,
    service: CVQueryService = Depends(get_cv_query_service),
) -> CVListResponse:
    cv_data = service.list_user_cvs(user_id=str(current_user.id))
    cv_list_items = [
        Cv(
            id=str(cv.id),
            file_name=cv.file_name or "",
            user_id=str(cv.user_id),
            created_at=cv.created_at,
            content=cv.content,
        )
        for cv in cv_data
    ]
    return CVListResponse(data=cv_list_items)


@router.post("/index-cv", response_model=CVIndexResponse)
async def index_cv(
    current_user: CurrentUser,
    file: UploadFile = File(...),
    service: CVIndexService = Depends(get_cv_index_service),
) -> CVIndexResponse:
    if file.filename and not file.filename.endswith(".pdf"):
        raise InvalidFileTypeError()

    path = save_temp_file(file)
    try:
        result = service.index_cv(path, user_id=str(current_user.id))

        return CVIndexResponse(
            data=CvIndex(
                filename=file.filename,
                chunks_created=result.get("chunks"),
                cv_id=str(result.get("cv_id")),
            )
        )

    except VectorStoreError as e:
        raise VectorStoreError(detail=e.detail, log_message=e.log_message) from e
    except ValueError as e:
        # Handle PDF extraction errors (empty PDF, unreadable, etc.)
        raise VectorStoreError(
            detail=str(e),
            log_message=f"PDF extraction failed: {str(e)}",
        ) from e
    except Exception as e:
        raise VectorStoreError(
            detail="An unexpected error occurred. Please try again later.",
            log_message=f"Unexpected error in index_cv: {str(e)}",
        ) from e
    finally:
        cleanup_file(path)


@router.post("/{cv_id}/profile", response_model=CVProfileCreateResponse)
async def generate_profile(
    cv_id: str,
    current_user: CurrentUser,
    service: CVProfileService = Depends(get_cv_profile_service),
) -> CVProfileCreateResponse:

    if not cv_id:
        raise MissingCVIdError()

    service.generate_profile(
        cv_id=cv_id,
        user_id=current_user.id,
    )

    return CVProfileCreateResponse(data=None)


@router.get("/profile", response_model=CVProfileResponse)
async def get_profile(
    current_user: CurrentUser,
    service: CVProfileService = Depends(get_cv_profile_service),
) -> CVProfileResponse:

    profile = service.get_profile_by_user_id(current_user.id)

    if not profile:
        return CVProfileResponse(data=None)

    return CVProfileResponse(
        data=CVProfile(
            user_id=str(profile.user_id),
            name=profile.name,
            summary=profile.summary,
            skills=profile.skills,
            experience=profile.experience,
            education=profile.education,
            cv_id=str(profile.cv_id),
        )
    )
