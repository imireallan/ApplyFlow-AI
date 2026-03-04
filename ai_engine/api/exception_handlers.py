from fastapi import HTTPException, status


class InvalidFileTypeError(HTTPException):
    def __init__(
        self, detail: str = "Invalid file type. Only PDF files are supported."
    ):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)
