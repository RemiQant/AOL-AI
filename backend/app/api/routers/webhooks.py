from fastapi import APIRouter, HTTPException, Security, BackgroundTasks, Depends
from fastapi.security import APIKeyHeader
from app.core.config import settings
from app.services.pipeline import run_daily_pipeline
import asyncio

router = APIRouter()

# We expect GitHub Actions to send a header like: X-Webhook-Secret: my_password
header_scheme = APIKeyHeader(name="X-Webhook-Secret")

def verify_webhook_secret(secret: str = Security(header_scheme)):
    if secret != settings.GITHUB_WEBHOOK_SECRET:
        raise HTTPException(status_code=401, detail="Invalid webhook secret signature.")
    return secret

@router.post("/daily-sync", status_code=202)
def trigger_daily_sync(background_tasks: BackgroundTasks, secret: str = Depends(verify_webhook_secret)):
    """
    Triggered securely by GitHub Actions. Returns 202 Accepted instantly to 
    prevent HTTP timeouts on PaaS providers, while running the ML pipeline asynchronously.
    """
    # Since run_daily_pipeline is async, we push it into the event loop
    background_tasks.add_task(lambda: asyncio.run(run_daily_pipeline()))
    
    return {
        "status": "accepted", 
        "message": "Webhook authenticated. Daily ML pipeline triggered in the background."
    }
