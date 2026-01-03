from config import supabase
from schemas.auth import SignupSchema
from fastapi import HTTPException, status, Request


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


async def login_user(email: str, password: str):
    response = supabase.auth.sign_in_with_password({"email": email, "password": password})
    if not response.user or not response.session or not response.session.access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    return response


