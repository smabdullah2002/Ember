from fastapi import HTTPException, status
from postgrest.exceptions import APIError
from config import supabase
from schemas.mood import MoodEntryCreateSchema


TABLE_NAME = "mood_entries"


async def create_mood_entry(user_id: str, payload: MoodEntryCreateSchema):
    note = payload.note.strip() if payload.note else None
    mood_label = payload.mood_label.strip() if payload.mood_label else None

    try:
        response = (
            supabase.table(TABLE_NAME)
            .insert(
                {
                    "user_id": user_id,
                    "mood_id": str(payload.mood_id) if payload.mood_id else None,
                    "mood_label": mood_label,
                    "emoji": payload.emoji,
                    "intensity": payload.intensity,
                    "note": note,
                }
            )
            .execute()
        )
    except APIError as error:
        error_code = getattr(error, "code", None)
        if error_code == "PGRST205":
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Mood table is not available in Supabase schema cache.",
            )
        raise

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save mood entry.",
        )

    return response.data[0]


async def list_mood_entries(user_id: str):
    try:
        response = (
            supabase.table(TABLE_NAME)
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
    except APIError as error:
        error_code = getattr(error, "code", None)
        if error_code == "PGRST205":
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Mood table is not available in Supabase schema cache.",
            )
        raise

    return response.data or []


async def delete_mood_entry(user_id: str, entry_id: str):
    try:
        response = (
            supabase.table(TABLE_NAME)
            .delete()
            .eq("id", entry_id)
            .eq("user_id", user_id)
            .execute()
        )
    except APIError as error:
        error_code = getattr(error, "code", None)
        if error_code == "PGRST205":
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Mood table is not available in Supabase schema cache.",
            )
        raise

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mood entry not found.",
        )

    return response.data[0]
