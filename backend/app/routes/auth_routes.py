from fastapi import APIRouter, Depends, status

from app.middlewares.auth_middleware import get_current_user
from app.models.user import (
    ChangePasswordRequest,
    MessageResponse,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserPublic,
)
from app.services.auth_service import change_user_password, login_user, register_user


router = APIRouter()


@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate) -> UserPublic:
    return await register_user(payload)


@router.post("/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def login(payload: UserLogin) -> TokenResponse:
    return await login_user(payload)


@router.post(
    "/change-password",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
)
async def change_password(
    payload: ChangePasswordRequest,
    current_user: UserPublic = Depends(get_current_user),
) -> MessageResponse:
    return await change_user_password(current_user.id, payload)
