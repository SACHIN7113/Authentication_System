from datetime import datetime, timezone

from bson import ObjectId
from fastapi import HTTPException, status

from app.models.user import (
    ChangePasswordRequest,
    MessageResponse,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserPublic,
)
from app.services.token_service import create_access_token
from app.utils.security import hash_password, verify_password
from config import settings
from db import get_database


async def register_user(payload: UserCreate) -> UserPublic:
    db = get_database()
    users_collection = db["users"]

    normalized_email = payload.email.lower()
    existing_user = await users_collection.find_one({"email": normalized_email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered.",
        )

    user_document = {
        "name": payload.name.strip(),
        "email": normalized_email,
        "hashed_password": hash_password(payload.password),
        "created_at": datetime.now(timezone.utc),
    }

    result = await users_collection.insert_one(user_document)

    return UserPublic(
        id=str(result.inserted_id),
        name=user_document["name"],
        email=user_document["email"],
    )


async def login_user(payload: UserLogin) -> TokenResponse:
    db = get_database()
    users_collection = db["users"]

    normalized_email = payload.email.lower()
    user = await users_collection.find_one({"email": normalized_email})

    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    expires_seconds = settings.access_token_expire_minutes * 60
    access_token = create_access_token(
        data={"sub": str(user["_id"]), "email": user["email"]}
    )

    return TokenResponse(access_token=access_token, expires_in=expires_seconds)


async def get_user_by_id(user_id: str) -> UserPublic | None:
    if not ObjectId.is_valid(user_id):
        return None

    db = get_database()
    users_collection = db["users"]

    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return None

    return UserPublic(id=str(user["_id"]), name=user["name"], email=user["email"])


async def change_user_password(user_id: str, payload: ChangePasswordRequest) -> MessageResponse:
    if not ObjectId.is_valid(user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user id.",
        )

    db = get_database()
    users_collection = db["users"]

    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    if not verify_password(payload.current_password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect.",
        )

    if verify_password(payload.new_password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password.",
        )

    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "hashed_password": hash_password(payload.new_password),
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )

    return MessageResponse(message="Password updated successfully.")
