from fastapi import APIRouter, Depends, status

from app.middlewares.auth_middleware import get_current_user
from app.models.user import ProfileResponse, UserPublic


router = APIRouter()


@router.get("/profile", response_model=ProfileResponse, status_code=status.HTTP_200_OK)
async def profile(current_user: UserPublic = Depends(get_current_user)) -> ProfileResponse:
    return ProfileResponse(user=current_user)
