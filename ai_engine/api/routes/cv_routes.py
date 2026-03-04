from typing import Any

from fastapi import APIRouter, Depends, File, UploadFile

from api.dependencies import get_cv_index_service
from api.exception_handlers import InvalidFileTypeError
from core.application.services.cv_index_service import CVIndexService
from infrastructure.filestorage.local_file_storage import cleanup_file, save_temp_file

router = APIRouter()


@router.post("/index-cv")  # noqa: misc
async def index_cv(
    file: UploadFile = File(...),
    service: CVIndexService = Depends(get_cv_index_service),
) -> dict[str, Any]:
    if file.filename and not file.filename.endswith(".pdf"):
        raise InvalidFileTypeError()

    path = save_temp_file(file)
    try:
        result = service.index_cv(path)
        return {
            "message": "CV indexed successfully",
            "filename": file.filename,
            "chunks_created": result.get("chunks"),
        }
    finally:
        cleanup_file(path)
