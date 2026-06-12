import json
import time
import logging
from typing import Any
import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger("cs2-predictor.gemini")

_CACHE_TTL = 6 * 3600  # refresh every 6 hours
_cache: tuple[list[dict], float] | None = None

_VALID_TRENDS     = {"up", "down", "stable"}
_VALID_SENTIMENTS = {"positive", "negative", "neutral"}
_VALID_CATEGORIES = {"update", "trade", "community", "valve", "price"}

_PROMPT = """\
You are a CS2 skin market analyst. Analyze the CS2 news articles below and \
extract the top 12 most discussed market keywords from the community.

Return a JSON array — no markdown, no extra text, ONLY valid JSON — where each \
object has exactly these fields:
  "word"      : short keyword or phrase (2-4 words)
  "count"     : estimated mention frequency, integer 100-2000
  "trend"     : one of "up", "down", "stable"
  "sentiment" : one of "positive", "negative", "neutral"
  "category"  : one of "update", "trade", "community", "valve", "price"

News articles:
{news_text}
"""


def _validate(raw: Any) -> dict | None:
    if not isinstance(raw, dict):
        return None
    try:
        return {
            "word":      str(raw["word"]),
            "count":     max(100, min(2000, int(raw["count"]))),
            "trend":     raw["trend"]     if raw["trend"]     in _VALID_TRENDS     else "stable",
            "sentiment": raw["sentiment"] if raw["sentiment"] in _VALID_SENTIMENTS else "neutral",
            "category":  raw["category"]  if raw["category"]  in _VALID_CATEGORIES else "community",
        }
    except (KeyError, TypeError, ValueError):
        return None


async def fetch_keyword_sentiments(news_items: list[dict]) -> list[dict]:
    """
    Call Gemini to extract keyword sentiment from a list of Steam news items.
    Results are cached for 6 hours. Returns [] if API key is not set or call fails.
    """
    global _cache

    if _cache is not None:
        data, ts = _cache
        if time.time() - ts < _CACHE_TTL:
            logger.info("Returning cached Gemini keyword sentiments (%d items)", len(data))
            return data

    if not settings.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not configured — skipping sentiment analysis")
        return []

    news_text = "\n\n".join(
        f"Title: {item.get('title', '')}\n{item.get('contents', '')[:600]}"
        for item in news_items[:15]
    )

    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")

        response = model.generate_content(_PROMPT.format(news_text=news_text))
        text = response.text.strip()

        # Strip markdown fences if Gemini wraps response in ```json ... ```
        if text.startswith("```"):
            parts = text.split("```")
            text = parts[1].lstrip("json").strip() if len(parts) >= 2 else text

        raw_list = json.loads(text)
        if not isinstance(raw_list, list):
            raise ValueError("Gemini response is not a JSON array")

        keywords = [v for item in raw_list if (v := _validate(item)) is not None][:12]

        _cache = (keywords, time.time())
        logger.info("Gemini extracted %d keyword sentiments", len(keywords))
        return keywords

    except Exception as exc:
        logger.error("Gemini sentiment analysis failed: %s", exc)
        return []
