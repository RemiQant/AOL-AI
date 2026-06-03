from fastapi import APIRouter
from typing import List
from app.core.database.supabase import supabase
from app.api.schemas.skin import MarketEventItem

router = APIRouter()


@router.get("/", response_model=List[MarketEventItem])
def get_market_events():
    """Return game update events from Supabase, most recent first."""
    rows = (
        supabase.table("game_updates")
        .select("id, date, title, is_market_shocker")
        .order("date", desc=True)
        .limit(50)
        .execute()
        .data
    )

    result = []
    for row in rows:
        impact = "positive" if row.get("is_market_shocker") else "neutral"
        result.append(
            MarketEventItem(
                id=str(row["id"]),
                date=str(row["date"]),
                title=row["title"],
                description=row["title"],
                impact=impact,
                priceChangePct=0.0,
                source="Steam News",
            )
        )
    return result
