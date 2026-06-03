from fastapi import APIRouter
from typing import List
from app.api.schemas.skin import NewsKeywordItem

router = APIRouter()

# Static seed keywords — pipeline can extend this with real NLP later
_KEYWORDS: List[NewsKeywordItem] = [
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
def get_keywords():
    """Return tracked CS2 market keywords and sentiment signals."""
    return _KEYWORDS
