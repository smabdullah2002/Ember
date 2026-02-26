from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from config import supabase
from schemas.mood import MoodEntryCreateSchema
from services.mood import create_mood_entry, list_mood_entries, delete_mood_entry


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
router = APIRouter()


@router.post("/mood-entries", status_code=status.HTTP_201_CREATED)
async def add_mood_entry(payload: MoodEntryCreateSchema, token: str = Depends(oauth2_scheme)):
    user = supabase.auth.get_user(token)
    if user.user is None:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )

    entry = await create_mood_entry(user.user.id, payload)
    return {"entry": entry}


@router.get("/mood-entries")
async def get_mood_entries(token: str = Depends(oauth2_scheme)):
    user = supabase.auth.get_user(token)
    if user.user is None:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )

    entries = await list_mood_entries(user.user.id)
    return {"entries": entries}


@router.delete("/mood-entries/{entry_id}")
async def remove_mood_entry(entry_id: str, token: str = Depends(oauth2_scheme)):
    user = supabase.auth.get_user(token)
    if user.user is None:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )

    deleted = await delete_mood_entry(user.user.id, entry_id)
    return {"entry": deleted}
