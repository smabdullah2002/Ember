from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from services.community_comment import add_comment
from schemas.comment import CommentSchema
from config import supabase
from fastapi import Query

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

router = APIRouter()


@router.post("/community/comment", status_code=status.HTTP_201_CREATED)
async def post_comment(comment: CommentSchema, token: str = Depends(oauth2_scheme)):
    user = supabase.auth.get_user(token)
    if user.user is None:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )
    created_comment = await add_comment(comment, user.user.id)
    return {
        "message": "Comment added successfully",
        "comment_id": created_comment[0]["id"],
    }


@router.get("/community/comments/{post_id}")
async def get_comments(
    post_id: str, limit: int = Query(10, ge=1), offset: int = Query(0, ge=0)
):
    response = (
        supabase.table("comments")
        .select("*")
        .eq("post_id", post_id)
        .range(offset, offset + limit - 1)
        .execute()
    )

    total = (
        supabase.table("comments")
        .select("id", count="exact")
        .eq("post_id", post_id)
        .execute()
    ).count

    return {"comments": response.data, "total": total}
