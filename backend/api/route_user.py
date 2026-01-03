from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import  OAuth2PasswordRequestForm
from services.authentication import create_user,login_user
from schemas.auth import SignupSchema


router = APIRouter()

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: SignupSchema):
    created_user = await create_user(user)
    return {"message": "User created successfully", "user_id": created_user.id}


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    auth_response = await login_user(form_data.username, form_data.password)
    return {
        "access_token": auth_response.session.access_token,
        "refresh_token": auth_response.session.refresh_token,
        "token_type": "bearer",
        "user_id": auth_response.user.id,
    }