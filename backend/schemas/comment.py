from pydantic import BaseModel

class CommentSchema(BaseModel):
    post_id:str
    user_id:str
    content:str