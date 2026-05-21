import httpx
from datetime import datetime
from typing import List, Dict, Any

class SteamWebAPI:
    BASE_URL = "https://api.steampowered.com"
    APP_ID = 730
    
    @classmethod
    async def get_current_players(cls) -> int:
        """
        Fetches the current concurrent players for CS2 (App 730).
        """
        url = f"{cls.BASE_URL}/ISteamUserStats/GetNumberOfCurrentPlayers/v1/"
        params = {"appid": cls.APP_ID}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            return data.get("response", {}).get("player_count", 0)

class SteamNewsAPI:
    BASE_URL = "https://api.steampowered.com"
    APP_ID = 730
    
    @classmethod
    async def get_recent_news(cls, count: int = 100) -> List[Dict[str, Any]]:
        """
        Fetches recent news patches and announcements for CS2.
        """
        url = f"{cls.BASE_URL}/ISteamNews/GetNewsForApp/v2/"
        params = {
            "appid": cls.APP_ID,
            "count": count,
            "maxlength": 1, # We only need the title or full text depending on keywords. Let's fetch full text.
        }
        # To get full text, maxlength=0 or omit it. Let's omit.
        del params["maxlength"]
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            return data.get("appnews", {}).get("newsitems", [])
    
    @classmethod
    def is_market_shocker(cls, news_text: str, news_title: str) -> bool:
        """
        Analyzes the news text and title to detect "shocker" events like new cases, operations.
        """
        text_lower = (news_title + " " + news_text).lower()
        keywords = ["new case", "operation", "release notes", "revolution case", "kilowatt case"]
        return any(keyword in text_lower for keyword in keywords)
