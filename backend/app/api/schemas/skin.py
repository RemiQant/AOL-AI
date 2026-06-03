from pydantic import BaseModel
from typing import List, Optional
import datetime


class SkinListItem(BaseModel):
    id: str
    weapon: str
    name: str
    wear: str
    category: str
    currentPrice: float
    changePct24h: float


class SkinPricePoint(BaseModel):
    date: str
    price: Optional[float]
    predicted: Optional[float]
    volume: int


class SkinDetailResponse(SkinListItem):
    priceData: List[SkinPricePoint]


class PlayerCountPoint(BaseModel):
    hour: str
    count: int


class PlayerCountResponse(BaseModel):
    current: int
    peak24h: int
    peak30d: int
    change24hPct: float
    trend: str
    history: List[PlayerCountPoint]


class MarketEventItem(BaseModel):
    id: str
    date: str
    title: str
    description: str
    impact: str
    priceChangePct: float
    source: str


class NewsKeywordItem(BaseModel):
    word: str
    count: int
    trend: str
    sentiment: str
    category: str
