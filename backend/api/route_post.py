from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from services.community_post import (
    create_community_post,
    update_community_post,
    delete_community_post,
)
from schemas.community import CommunityPostSchema
from fastapi.security import OAuth2PasswordBearer
from config import supabase


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

router = APIRouter()


@router.post("/community/post", status_code=status.HTTP_201_CREATED)
async def post_community(
    post: CommunityPostSchema, token: str = Depends(oauth2_scheme)
):
    user = supabase.auth.get_user(token)
    if user.user is None:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )
    created_post = await create_community_post(post, user.user.id)
    return {
        "message": "Community post created successfully",
        "post_id": created_post[0]["id"],
    }


@router.get("/community/posts")
async def get_community_posts():
    response = supabase.table("community_post").select("*").execute()
    posts = []

    for post in response.data:
        author = "Anonymous"
        if post.get("user_id"):
            profile = (
                supabase.table("profile")
                .select("first_name")
                .eq("id", post["user_id"])
                .single()
                .execute()
            )
            if profile.data and profile.data.get("first_name"):
                author = profile.data["first_name"]
        posts.append(
            {
                "id": post["id"],
                "title": post["title"],
                "content": post["content"],
                "catagory": post["catagory"],
                "author": author,
                "author_id": post.get("user_id"),
                "created_at": post["created_at"],
            }
        )
    return {"posts": posts}


@router.put("/community/post/{post_id}")
async def put_community_post(
    post_id: str, post: CommunityPostSchema, token: str = Depends(oauth2_scheme)
):
    user = supabase.auth.get_user(token)
    if user.user is None:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )
    updated_post = await update_community_post(post_id, post)
    return {
        "message": "Community post updated successfully",
        "post_id": updated_post[0]["id"],
    }


@router.delete("/community/post/{post_id}")
async def delete_community_post_endpoint(post_id: str, token: str = Depends(oauth2_scheme)):
    user = supabase.auth.get_user(token)
    if user.user is None:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )
    deleted_post = await delete_community_post(post_id)
    return {
        "message": "Community post deleted successfully",
        "post_id": deleted_post[0]["id"],
    }
