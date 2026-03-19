from fastapi import FastAPI, HTTPException
from schemas.comment import CommentSchema
from config import supabase
from transformers import pipeline
import math


toxic_classifier = pipeline(
    "text-classification", model="martin-ha/toxic-comment-model", device=-1
)

toxic_threshold = 0.5 


def is_toxic(text: str):
    result = toxic_classifier(text)[0]
    return result["label"] == "toxic" and result["score"] >= toxic_threshold


async def add_comment(data: CommentSchema, user_id: str):
    print(f"Rejected toxic comment: {data.content[:50]}...")
    if is_toxic(data.content):
        raise HTTPException(
            status_code=400,
            detail="Comment was flagged as toxic and could not be posted.",
        )
       

    response = (
        supabase.table("comments")
        .insert({"post_id": data.post_id, "user_id": user_id, "comment": data.content})
        .execute()
    )

    if not response:
        raise HTTPException(status_code=500, detail="Failed to add comment.")

    return response.data


async def get_comments_paginated(post_id: str, page: int = 1, page_size: int = 10):
    offset = (page - 1) * page_size

    response = (
        supabase.table("comments")
        .select("*")
        .eq("post_id", post_id)
        .order("created_at", desc=True)
        .range(offset, offset + page_size - 1)
        .execute()
    )

    total = (
        supabase.table("comments")
        .select("id", count="exact")
        .eq("post_id", post_id)
        .execute()
    ).count or 0

    total_pages = math.ceil(total / page_size) if total > 0 else 0

    return {
        "comments": response.data,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_previous": page > 1,
        },
    }
