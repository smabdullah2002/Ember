from config import supabase
from schemas.auth import SignupSchema
from fastapi import HTTPException, status, Request
from fastapi.security import (
    OAuth2PasswordBearer,
)
from fastapi import Depends
from jose import jwt
from config import SUPABASE_JWT_SECRET


async def create_user(user: SignupSchema):
    response = supabase.auth.sign_up({"email": user.email, "password": user.password})
    if not response.user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=response.message
        )

    supabase.table("profile").insert(
        {
            "id": response.user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        }
    ).execute()

    return response.user


