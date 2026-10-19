from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from base import api_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
        "https://ember-mentalhealth-companion.netlify.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/ping")
@app.get("/health")
def ping_db():
    try:
        from config import supabase
        res = supabase.table("community_post").select("id").limit(1).execute()
        return {"status": "ok", "message": "Database pinged successfully", "data": res.data}
    except Exception as e:
        return {"status": "error", "message": str(e)}


app.include_router(api_router)
