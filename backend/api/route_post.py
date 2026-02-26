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
from pydantic import BaseModel


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
    response = (
        supabase.table("community_post")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )
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
        likes= (
            supabase.table("post_likes")
            .select("*", count="exact")
            .eq("post_id", post["id"])
            .execute()
        )
        posts.append(
            {
                "id": post["id"],
                "title": post["title"],
                "content": post["content"],
                "catagory": post["catagory"],
                "author": author,
                "likes": likes.count,
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
async def delete_community_post_endpoint(
    post_id: str, token: str = Depends(oauth2_scheme)
):
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


class LikeRequest(BaseModel):
    likes: int


@router.patch("/community/post/{post_id}/like")
async def like_community_post(post_id: str, token: str = Depends(oauth2_scheme)):
    try:
        user = supabase.auth.get_user(token)
        user_id = user.user.id
        print(f"User ID: {user_id}, Post ID: {post_id}")

        existing = (
            supabase.table("post_likes")
            .select("id")
            .eq("post_id", post_id)
            .eq("user_id", user_id)
            .execute()
        )
        if existing.data:
            supabase.table("post_likes").delete().eq("post_id", post_id).eq(
                "user_id", user_id
            ).execute()
            liked = False
        else:
            supabase.table("post_likes").insert(
                {"post_id": post_id, "user_id": user_id}
            ).execute()
            liked = True

        count = (
            supabase.table("post_likes")
            .select("*", count="exact")
            .eq("post_id", post_id)
            .execute()
        )

        return {"liked": liked, "likes": count.count}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
