import os
import math

import requests
from fastapi import HTTPException
from schemas.comment import CommentSchema
from config import supabase


HF_API_KEY = os.getenv("HF_API_KEY")
HF_TOXIC_MODEL = os.getenv("HF_TOXIC_MODEL", "martin-ha/toxic-comment-model")
HF_TOXIC_ENDPOINT = f"https://router.huggingface.co/hf-inference/models/{HF_TOXIC_MODEL}"
TOXIC_THRESHOLD = float(os.getenv("TOXIC_THRESHOLD", "0.5"))
MODERATION_FAIL_CLOSED = os.getenv("MODERATION_FAIL_CLOSED", "true").lower() == "true"


def is_toxic(text: str):
    if not HF_API_KEY:
        print(
            f"[TOXICITY] score=N/A label=missing_hf_api_key threshold=N/A toxic={MODERATION_FAIL_CLOSED}",
            flush=True,
        )
        return MODERATION_FAIL_CLOSED

    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "inputs": text,
        "parameters": {"top_k": 1},
    }

    
    response = requests.post(HF_TOXIC_ENDPOINT, headers=headers, json=payload, timeout=8)
    res=response.json()
    if(res[0][0]['label']=='toxic' and res[0][0]['score']>=TOXIC_THRESHOLD):
        return True

    
    return False
       


async def add_comment(data: CommentSchema, user_id: str):
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
