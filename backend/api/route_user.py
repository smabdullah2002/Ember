from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import  OAuth2PasswordRequestForm
from services.authentication import create_user
from schemas.auth import SignupSchema

router = APIRouter()

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: SignupSchema):
    created_user = await create_user(user)
    return {"message": "User created successfully", "user_id": created_user.id}