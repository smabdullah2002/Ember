from fastapi import APIRouter
from api import (
    route_user,
    route_chat,
    route_post,
    route_comment,
    route_journal,
    route_mood,
)


api_router = APIRouter()

# include the user authentication routes
api_router.include_router(route_user.router, prefix="", tags=["user"])
# include the blog routes
api_router.include_router(route_chat.router, prefix="", tags=["chat"])

api_router.include_router(route_post.router, prefix="", tags=["community_post"])

api_router.include_router(route_comment.router, prefix="", tags=["community_comment"])

api_router.include_router(route_journal.router, prefix="", tags=["journal"])

api_router.include_router(route_mood.router, prefix="", tags=["mood"])
