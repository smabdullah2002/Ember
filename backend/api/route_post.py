from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import  OAuth2PasswordRequestForm
from services.community_post import create_community_post
from schemas.community import CommunityPostSchema
from fastapi.security import OAuth2PasswordBearer
from config import supabase



oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

router = APIRouter()

@router.post("/community/post", status_code=status.HTTP_201_CREATED)
async def post_community(post: CommunityPostSchema, token: str = Depends(oauth2_scheme)):
    user= supabase.auth.get_user(token)
    if user.user is None:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )
    created_post = await create_community_post(post, user.user.id)
    return {"message": "Community post created successfully", "post_id": created_post[0]['id']}