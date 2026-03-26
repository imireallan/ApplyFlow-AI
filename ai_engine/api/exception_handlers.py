import logging
from typing import Optional

from fastapi import HTTPException, status

logger = logging.getLogger(__name__)


class InvalidFileTypeError(HTTPException):
    def __init__(
        self, detail: str = "Invalid file type. Only PDF files are supported."
    ):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

class MissingCVIdError(HTTPException):
    def __init__(
        self, detail: str = "Missing CV Id"
    ):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

class VectorStoreError(HTTPException):
    def __init__(
        self,
        detail: str = "Vector store operation failed. Please try again later.",
        status_code: int = status.HTTP_503_SERVICE_UNAVAILABLE,
        log_message: Optional[str] = None,
    ):
        # Provide more specific error messages based on the log_message
        if log_message:
            # Check for specific Pinecone error patterns
            if "not found" in log_message.lower():
                detail = "Vector store index not found. Please contact support."
            elif (
                "connection" in log_message.lower() or "connect" in log_message.lower()
            ):
                detail = "Unable to connect to vector store. Please try again later."
            elif "upsert" in log_message.lower():
                detail = "Failed to save CV data to vector store. Please try again."
            elif "query" in log_message.lower():
                detail = "Failed to search CVs. Please try again later."
            else:
                detail = f"Vector store error: {log_message[:100]}"

        super().__init__(status_code=status_code, detail=detail)
        # Store log_message as instance attribute for access later
        self.log_message = log_message
        # Log the detailed message for debugging
        if log_message:
            logger.error(log_message)
