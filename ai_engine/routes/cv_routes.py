import os
import shutil
from fastapi import APIRouter, Request, UploadFile, File, HTTPException
from services.vector_service import VectorService
from models.schema import QueryRequest
from routes.auth_routes import get_current_user

router = APIRouter()
vector_service = VectorService()
UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/search-cv")
async def search_cv(request: Request, payload: QueryRequest):
    get_current_user(request)
    try:
        results = vector_service.query_cv(
            job_description=payload.job_description, 
            k=request.top_k
        )
        return {"status": "success", "matches": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/index-cv")
async def index_cv(request: Request, file: UploadFile = File(...)):
    get_current_user(request)
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        result = vector_service.upsert_cv(file_path)
        return {
            "message": "CV indexed successfully",
            "filename": file.filename,
            "chunks_created": result.get("chunks")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)