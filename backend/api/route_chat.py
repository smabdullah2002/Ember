
from fastapi import APIRouter, Depends, HTTPException, status
from schemas.chat import ChatRequest
from services.chatbot import chat_endpoint,get_checklist,update_checklist
from fastapi.security import OAuth2PasswordBearer
from config import supabase
from pydantic import BaseModel
from datetime import date

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
router = APIRouter()


@router.post("/chat")
async def chat_point(request: ChatRequest, token: str = Depends(oauth2_scheme)):
    try:
        user = supabase.auth.get_user(token)

        if not user or not user.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )

        response = await chat_endpoint(user_id=user.user.id, user_msg=request.message)

        return response 

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing chat: {str(e)}",
        )

@router.get("/checklist")
async def get_user_checklist(token: str = Depends(oauth2_scheme)):
    try:
        user = supabase.auth.get_user(token)

        if not user or not user.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )

        checklist =await get_checklist(user_id=user.user.id)
        return checklist

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving checklist: {str(e)}",
        )

class ChecklistUpdateRequest(BaseModel):
    items: list

@router.patch("/checklist/update")
async def update_user_checklist(req: ChecklistUpdateRequest, token: str = Depends(oauth2_scheme)):
    try:
        user = supabase.auth.get_user(token)

        if not user or not user.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )

        await update_checklist(user_id=user.user.id, items=req.items)
        return {"message": "Checklist updated successfully"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating checklist: {str(e)}",
        )