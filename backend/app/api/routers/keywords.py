import logging
from fastapi import APIRouter
from typing import List
from app.api.schemas.skin import NewsKeywordItem
from app.services.gemini import fetch_keyword_sentiments
from app.services.steam import SteamNewsAPI

router = APIRouter()
logger = logging.getLogger("cs2-predictor.keywords")

_FALLBACK: List[NewsKeywordItem] = [
    NewsKeywordItem(word="trade-up contract", count=1240, trend="up",     sentiment="negative", category="trade"),
    NewsKeywordItem(word="market crash",      count=934,  trend="down",   sentiment="negative", category="valve"),
    NewsKeywordItem(word="investment return", count=893,  trend="up",     sentiment="positive", category="community"),
    NewsKeywordItem(word="valve update",      count=847,  trend="up",     sentiment="neutral",  category="update"),
    NewsKeywordItem(word="CS2 major",         count=756,  trend="up",     sentiment="positive", category="community"),
    NewsKeywordItem(word="operation launch",  count=654,  trend="up",     sentiment="positive", category="update"),
    NewsKeywordItem(word="AI prediction",     count=621,  trend="up",     sentiment="positive", category="price"),
    NewsKeywordItem(word="price recovery",    count=582,  trend="up",     sentiment="positive", category="price"),
    NewsKeywordItem(word="skin trading",      count=567,  trend="stable", sentiment="neutral",  category="trade"),
    NewsKeywordItem(word="knife skin",        count=523,  trend="stable", sentiment="positive", category="price"),
    NewsKeywordItem(word="float value",       count=412,  trend="up",     sentiment="neutral",  category="trade"),
    NewsKeywordItem(word="ban wave",          count=312,  trend="down",   sentiment="negative", category="valve"),
]


@router.get("/", response_model=List[NewsKeywordItem])
async def get_keywords():
    """
    Return CS2 market keyword sentiment signals.
    Fetches recent Steam news and analyzes them with Gemini.
    Falls back to static seed data if Gemini is unavailable.
    """
    try:
        news = await SteamNewsAPI.get_recent_news(count=20)
    except Exception as exc:
        logger.warning("Steam News API unavailable: %s — using fallback keywords", exc)
        return _FALLBACK

    if not news:
        return _FALLBACK

    gemini_results = await fetch_keyword_sentiments(news)

    if gemini_results:
        return [NewsKeywordItem(**kw) for kw in gemini_results]

    logger.info("Gemini returned no results — using fallback keywords")
    return _FALLBACK
