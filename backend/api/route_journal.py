from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from config import supabase
from schemas.journal import JournalCreateSchema, JournalUpdateSchema
from services.journal import (
    create_journal_entry,
    get_journal_entries,
    update_journal_entry,
    delete_journal_entry,
)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
router = APIRouter()


@router.post("/journal", status_code=status.HTTP_201_CREATED)
async def add_journal(entry: JournalCreateSchema, token: str = Depends(oauth2_scheme)):
    user = supabase.auth.get_user(token)
    if user.user is None:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )

    saved_entry = await create_journal_entry(user.user.id, entry)
    return {"message": "Journal entry saved", "entry": saved_entry}


@router.get("/journal")
async def list_journals(token: str = Depends(oauth2_scheme)):
    user = supabase.auth.get_user(token)
    if user.user is None:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )

    entries = await get_journal_entries(user.user.id)
    return {"entries": entries}


@router.put("/journal/{entry_id}")
async def update_journal(
    entry_id: str, entry: JournalUpdateSchema, token: str = Depends(oauth2_scheme)
):
    user = supabase.auth.get_user(token)
    if user.user is None:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )

    updated_entry = await update_journal_entry(user.user.id, entry_id, entry)
    return {"message": "Journal entry updated", "entry": updated_entry}


@router.delete("/journal/{entry_id}")
async def delete_journal(entry_id: str, token: str = Depends(oauth2_scheme)):
    user = supabase.auth.get_user(token)
    if user.user is None:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )

    deleted_entry = await delete_journal_entry(user.user.id, entry_id)
    return {"message": "Journal entry deleted", "entry": deleted_entry}
