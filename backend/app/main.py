from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers import skins

app = FastAPI(
    title="CS2 Bluechip Price Predictor API",
    description="Backend AI pipeline and Supabase connection layer for CS2 items.",
    version="1.0.0"
)

# Allow React to fetch data without CORS errors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Endpoints
app.include_router(skins.router, prefix="/api/v1/skins", tags=["Skins Dashboard"])

@app.get("/")
def health_check():
    return {"status": "ok", "message": "CS2 Price Predictor is running."}
