import os
import shutil
import uuid

from fastapi import UploadFile

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def save_temp_file(file: UploadFile) -> str:
    """
    Save uploaded file to a temporary directory.
    Returns absolute file path.
    """
    unique_name = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return file_path


def cleanup_file(file_path: str) -> None:
    """
    Safely delete file if it exists.
    """
    if os.path.exists(file_path):
        os.remove(file_path)
