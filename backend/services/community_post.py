from config import supabase
from fastapi import HTTPException, status, Depends
from schemas.community import CommunityPostSchema
from fastapi.security import OAuth2PasswordBearer



async def create_community_post(post: CommunityPostSchema, user_id: str):
    
        
    response= supabase.table("community_post").insert(
        {
            "catagory": post.catagory,
            "title": post.title,
            "content": post.content,
            "user_id": user_id,
        }
    ).execute()
    if not response:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create community post.",
        )
    return response.data
        