from fastapi import APIRouter, Depends, HTTPException, status
from schemas.chat import ChatRequest
from services.chatbot import chat_endpoint

router = APIRouter()

@router.post("/chat")
async def chat_point(request:ChatRequest):
    return await chat_endpoint(request)