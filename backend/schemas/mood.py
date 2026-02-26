from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID


class MoodEntryCreateSchema(BaseModel):
    mood_id: Optional[UUID] = None
    mood_label: Optional[str] = None
    emoji: Optional[str] = None
    intensity: int = Field(ge=1, le=10)
    note: Optional[str] = None
