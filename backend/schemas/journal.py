from pydantic import BaseModel, Field


class JournalCreateSchema(BaseModel):
    title: str = Field(default="Untitled Entry", max_length=150)
    content: str = Field(min_length=1)


class JournalUpdateSchema(BaseModel):
    title: str = Field(default="Untitled Entry", max_length=150)
    content: str = Field(min_length=1)
