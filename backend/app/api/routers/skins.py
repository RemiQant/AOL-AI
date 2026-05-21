from fastapi import APIRouter, HTTPException, Path
from pydantic import BaseModel
from typing import Any
from app.core.database.supabase import supabase
from app.api.schemas.skin import SkinResponse
from datetime import datetime

router = APIRouter()

@router.get("/{hash_name}", response_model=SkinResponse)
def get_skin_prediction(hash_name: str = Path(..., description="The exact URL-encoded hash name of the skin.")):
    """
    Fetches the 30-day historical data and 7-day AI prediction for a specific CS2 skin.
    """
    # 1. Resolve hash_name to item_id
    item_res = supabase.table("items").select("*").eq("hash_name", hash_name).execute()
    if not item_res.data:
        raise HTTPException(status_code=404, detail="Skin not tracked or spelling is incorrect.")
    
    item_id = item_res.data[0]['id']
    
    # 2. Query last 30 days of historical prices (sorted descending to get latest, then reverse to chronological)
    hist_res = supabase.table("historical_prices")\
        .select("date, median_price, volume")\
        .eq("item_id", item_id)\
        .order("date", desc=True)\
        .limit(30).execute()
        
    historical_data = hist_res.data[::-1] # Reverse to chronological order
    
    # 3. Query 7 days of future AI predictions
    today = datetime.now().date().isoformat()
    pred_res = supabase.table("ai_predictions")\
        .select("target_date, predicted_price")\
        .eq("item_id", item_id)\
        .gte("target_date", today)\
        .order("target_date", desc=False)\
        .limit(7).execute()
        
    # Return matched against our precise Pydantic schema Model
    return {
        "item_name": hash_name,
        "currency": "USD",
        "historical_data": historical_data,
        "ai_predictions": pred_res.data
    }
