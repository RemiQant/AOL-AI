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

    @classmethod
    async def get_historical_players(cls) -> List[Dict[str, Any]]:
        """
        Fetches historical concurrent players for CS2 from SteamCharts HTML table.
        Returns a list of dicts with 'month' (YYYY-MM), 'avg_players', and 'peak_players'.
        """
        from bs4 import BeautifulSoup
        
        url = f"https://steamcharts.com/app/{cls.APP_ID}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        
        try:
            async with httpx.AsyncClient(headers=headers) as client:
                response = await client.get(url)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, "html.parser")
                table = soup.find("table", class_="common-table")
                if not table:
                    return []
                
                rows = table.find_all("tr")
                history = []
                
                for row in rows[1:]:  # Skip header
                    cols = row.find_all("td")
                    if len(cols) >= 5:
                        month_str = cols[0].text.strip()
                        avg_str = cols[1].text.strip()
                        peak_str = cols[4].text.strip()
                        
                        # Skip 'Last 30 Days' row
                        if month_str.lower() == "last 30 days":
                            continue
                            
                        # Parse 'April 2026' into '2026-04'
                        try:
                            dt = datetime.strptime(month_str, "%B %Y")
                            formatted_month = dt.strftime("%Y-%m")
                            
                            history.append({
                                "month": formatted_month,
                                "avg_players": float(avg_str),
                                "peak_players": int(peak_str)
                            })
                        except ValueError:
                            continue
                            
                return history
        except Exception as e:
            print(f"Error scraping SteamCharts HTML: {e}")
            return []

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
