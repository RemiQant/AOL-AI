from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers import skins, players, events, keywords

app = FastAPI(
    title="CS2 Bluechip Price Predictor API",
    description="Backend AI pipeline and Supabase connection layer for CS2 items.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(skins.router,    prefix="/api/v1/skins",    tags=["Skins"])
app.include_router(players.router,  prefix="/api/v1/players",  tags=["Players"])
app.include_router(events.router,   prefix="/api/v1/events",   tags=["Events"])
app.include_router(keywords.router, prefix="/api/v1/keywords", tags=["Keywords"])


@app.get("/")
def health_check():
    return {"status": "ok", "message": "CS2 Price Predictor is running."}
