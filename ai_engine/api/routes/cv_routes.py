from typing import Any

from fastapi import APIRouter, Depends, File, UploadFile

from api.dependencies.cv import get_cv_index_service, get_cv_profile_service
from api.exception_handlers import InvalidFileTypeError, VectorStoreError
from api.schemas.cv_schema import CVIndexResponse
from core.application.services.cv_index_service import CVIndexService
from core.application.services.cv_profile_service import CVProfileService
from core.security.dependencies import CurrentUser
from infrastructure.filestorage.local_file_storage import cleanup_file, save_temp_file

router = APIRouter()


@router.post("/index-cv", response_model=CVIndexResponse)  # noqa: misc
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
            message="CV indexed successfully",
            filename=file.filename,
            chunks_created=result.get("chunks"),
            cv_id=str(result.get("cv_id")),
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


@router.post("/{cv_id}/profile")
async def generate_profile(
    cv_id: str,
    current_user: CurrentUser,
    service: CVProfileService = Depends(get_cv_profile_service),
) -> dict[str, Any]:

    profile = service.generate_profile(
        cv_id=cv_id,
        user_id=str(current_user.id),
    )

    return {
        "status": "success",
        "data": profile,
    }


@router.get("/profile")
async def get_profile(
    current_user: CurrentUser,
    service: CVProfileService = Depends(get_cv_profile_service),
) -> dict[str, Any]:

    profile = service.get_profile_by_user_id(str(current_user.id))

    if not profile:
        return {
            "status": "success",
            "data": None,
        }

    return {
        "status": "success",
        "data": profile,
    }
