from fastapi import APIRouter
from app.core.database.supabase import supabase
from app.api.schemas.skin import PlayerCountResponse, PlayerCountPoint

router = APIRouter()


@router.get("/", response_model=PlayerCountResponse)
def get_player_count():
    """Return latest player count stats and 30-day history from Supabase."""
    rows = (
        supabase.table("player_counts")
        .select("date, concurrent_players")
        .order("date", desc=True)
        .limit(30)
        .execute()
        .data
    )

    if not rows:
        return PlayerCountResponse(
            current=0, peak24h=0, peak30d=0,
            change24hPct=0.0, trend="stable", history=[],
        )

    current = rows[0]["concurrent_players"]
    prev = rows[1]["concurrent_players"] if len(rows) > 1 else current
    peak30d = max(r["concurrent_players"] for r in rows)

    change = 0.0
    if prev > 0:
        change = round(((current - prev) / prev) * 100, 2)

    trend = "up" if change > 0.5 else ("down" if change < -0.5 else "stable")

    history = [
        PlayerCountPoint(hour=str(r["date"]), count=r["concurrent_players"])
        for r in reversed(rows)
    ]

    return PlayerCountResponse(
        current=current,
        peak24h=current,
        peak30d=peak30d,
        change24hPct=change,
        trend=trend,
        history=history,
    )
