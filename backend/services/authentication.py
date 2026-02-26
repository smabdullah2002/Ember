from config import supabase
from schemas.auth import SignupSchema
from fastapi import HTTPException, status, Request
import re


NAME_REGEX = re.compile(r"^[A-Za-z][A-Za-z\s'-]{1,49}$")
EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
PASSWORD_REGEX = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$")


async def create_user(user: SignupSchema):
    first_name = user.first_name.strip()
    last_name = user.last_name.strip()
    email = str(user.email).strip()

    if not NAME_REGEX.match(first_name):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="First name must be 2-50 characters and contain only letters, spaces, apostrophes, or hyphens.",
        )

    if not NAME_REGEX.match(last_name):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Last name must be 2-50 characters and contain only letters, spaces, apostrophes, or hyphens.",
        )

    if not EMAIL_REGEX.match(email):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid email format.",
        )

    if not PASSWORD_REGEX.match(user.password):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
        )

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


