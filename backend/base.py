from fastapi import APIRouter
from api import route_user
from api import route_chat

api_router = APIRouter()

# include the user authentication routes
api_router.include_router(route_user.router, prefix="", tags=["user"])
# include the blog routes
api_router.include_router(route_chat.router, prefix="", tags=["chat"])
