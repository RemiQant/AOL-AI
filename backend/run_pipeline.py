import asyncio
import logging
from app.services.pipeline import run_daily_pipeline
from app.core.logger import logger

if __name__ == "__main__":
    logger.info("Initializing manual run of daily ML pipeline...")
    asyncio.run(run_daily_pipeline())
