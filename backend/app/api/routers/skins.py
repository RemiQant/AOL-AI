from fastapi import APIRouter, HTTPException, Path
from typing import List
from app.core.database.supabase import supabase
from app.core.utils import parse_hash_name
from app.api.schemas.skin import SkinListItem, SkinDetailResponse, SkinPricePoint
from datetime import datetime

router = APIRouter()


def _compute_change(latest: float, previous: float) -> float:
    if previous <= 0:
        return 0.0
    return round(((latest - previous) / previous) * 100, 2)


@router.get("/", response_model=List[SkinListItem])
def list_skins():
    """List all tracked skins with current price and 24h change."""
    items = supabase.table("items").select("id, hash_name").execute().data
    result = []
    for item in items:
        prices = (
            supabase.table("historical_prices")
            .select("median_price")
            .eq("item_id", item["id"])
            .order("date", desc=True)
            .limit(2)
            .execute()
            .data
        )
        if not prices:
            continue
        current = float(prices[0]["median_price"])
        prev = float(prices[1]["median_price"]) if len(prices) > 1 else current
        parsed = parse_hash_name(item["hash_name"])
        result.append(
            SkinListItem(
                id=item["hash_name"],
                currentPrice=current,
                changePct24h=_compute_change(current, prev),
                **parsed,
            )
        )
    return result


@router.get("/{hash_name}", response_model=SkinDetailResponse)
def get_skin_detail(hash_name: str = Path(..., description="URL-encoded hash name")):
    """Fetch 90-day history + 7-day AI forecast for one skin."""
    item_res = supabase.table("items").select("id").eq("hash_name", hash_name).execute()
    if not item_res.data:
        raise HTTPException(status_code=404, detail="Skin not found.")

    item_id = item_res.data[0]["id"]

    hist = (
        supabase.table("historical_prices")
        .select("date, median_price, volume")
        .eq("item_id", item_id)
        .order("date", desc=True)
        .limit(90)
        .execute()
        .data[::-1]
    )

    today = datetime.now().date().isoformat()
    preds = (
        supabase.table("ai_predictions")
        .select("target_date, predicted_price")
        .eq("item_id", item_id)
        .gte("target_date", today)
        .order("target_date")
        .limit(7)
        .execute()
        .data
    )

    # Merge into a single priceData list keyed by date
    price_map: dict = {}
    for h in hist:
        d = str(h["date"])
        price_map[d] = SkinPricePoint(
            date=d, price=float(h["median_price"]), predicted=None, volume=h["volume"]
        )
    for p in preds:
        d = str(p["target_date"])
        if d in price_map:
            price_map[d].predicted = float(p["predicted_price"])
        else:
            price_map[d] = SkinPricePoint(
                date=d, price=None, predicted=float(p["predicted_price"]), volume=0
            )

    price_data = sorted(price_map.values(), key=lambda x: x.date)

    current = float(hist[-1]["median_price"]) if hist else 0.0
    prev = float(hist[-2]["median_price"]) if len(hist) >= 2 else current
    parsed = parse_hash_name(hash_name)

    return SkinDetailResponse(
        id=hash_name,
        currentPrice=current,
        changePct24h=_compute_change(current, prev),
        priceData=price_data,
        **parsed,
    )
