from fastapi import APIRouter, Response, Request, Depends, HTTPException
from models.schema import GoogleLoginRequest
from services.auth_service import AuthService
from core.security import verify_token, create_auth_cookie

router = APIRouter()
auth_service = AuthService()


@router.post("/google")
def google_login(payload: GoogleLoginRequest, response: Response):
    try:
        token, user = auth_service.login_user(payload.id_token)
        create_auth_cookie(response, token)
        return {"status": "success", "user": user}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    return verify_token(token)


@router.get("/me")
def me(user=Depends(get_current_user)):
    return {"status": "success", "user": user}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"status": "logged_out"}