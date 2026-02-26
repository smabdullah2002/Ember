from fastapi import HTTPException, status
from config import supabase
from schemas.journal import JournalCreateSchema, JournalUpdateSchema
from postgrest.exceptions import APIError


async def create_journal_entry(user_id: str, entry: JournalCreateSchema):
    title = entry.title.strip() if entry.title else "Untitled Entry"
    if not title:
        title = "Untitled Entry"

    content = entry.content.strip()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Journal content cannot be empty.",
        )

    try:
        response = (
            supabase.table("journal_entries")
            .insert({"user_id": user_id, "title": title, "content": content})
            .execute()
        )
    except APIError as error:
        error_code = getattr(error, "code", None)
        if error_code == "PGRST205":
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Journal table is not ready in Supabase. Please run backend/sql/create_journal_entries.sql in the Supabase SQL Editor, then retry.",
            )
        raise

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save journal entry.",
        )

    return response.data[0]


async def get_journal_entries(user_id: str):
    try:
        response = (
            supabase.table("journal_entries")
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
                detail="Journal table is not ready in Supabase. Please run backend/sql/create_journal_entries.sql in the Supabase SQL Editor, then retry.",
            )
        raise

    return response.data or []


async def update_journal_entry(user_id: str, entry_id: str, entry: JournalUpdateSchema):
    title = entry.title.strip() if entry.title else "Untitled Entry"
    if not title:
        title = "Untitled Entry"

    content = entry.content.strip()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Journal content cannot be empty.",
        )

    try:
        response = (
            supabase.table("journal_entries")
            .update({"title": title, "content": content})
            .eq("id", entry_id)
            .eq("user_id", user_id)
            .execute()
        )
    except APIError as error:
        error_code = getattr(error, "code", None)
        if error_code == "PGRST205":
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Journal table is not ready in Supabase. Please run backend/sql/create_journal_entries.sql in the Supabase SQL Editor, then retry.",
            )
        raise

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found.",
        )

    return response.data[0]


async def delete_journal_entry(user_id: str, entry_id: str):
    try:
        response = (
            supabase.table("journal_entries")
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
                detail="Journal table is not ready in Supabase. Please run backend/sql/create_journal_entries.sql in the Supabase SQL Editor, then retry.",
            )
        raise

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found.",
        )

    return response.data[0]
