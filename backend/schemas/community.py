from pydantic import BaseModel

class CommunityPostSchema(BaseModel):
    catagory: str
    title: str
    content: str