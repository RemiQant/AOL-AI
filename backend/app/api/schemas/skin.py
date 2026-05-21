from pydantic import BaseModel, Field
from typing import List
import datetime

class HistoricalDataPoint(BaseModel):
    date: datetime.date
    price: float = Field(..., alias="median_price")
    volume: int
    
    class Config:
        populate_by_name = True

class AIPredictionPoint(BaseModel):
    date: datetime.date = Field(..., alias="target_date")
    predicted_price: float
    
    class Config:
        populate_by_name = True

class SkinResponse(BaseModel):
    item_name: str
    currency: str = "USD"
    historical_data: List[HistoricalDataPoint]
    ai_predictions: List[AIPredictionPoint]
