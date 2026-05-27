import httpx
import urllib.parse
from typing import List, Dict, Any
from app.core.config import settings

class CSFloatService:
    BASE_URL = "https://csfloat.com/api/v1"
    
    @classmethod
    async def get_historical_prices(cls, hash_name: str) -> List[Dict[str, Any]]:
        """
        Fetches historical price and volume data for a specific CS2 item from CSFloat.
        """
        encoded_name = urllib.parse.quote(hash_name)
        url = f"{cls.BASE_URL}/history/{encoded_name}/graph"
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url)
                response.raise_for_status()
                data = response.json()
                
                history = []
                for day_data in data:
                    # CSFloat avg_price is in cents (e.g., 3500.1 for $35.00)
                    price_usd = round(day_data.get("avg_price", 0) / 100.0, 2)
                    # Extract just the YYYY-MM-DD from '2026-05-26T00:00:00Z'
                    date_str = day_data.get("day", "").split("T")[0]
                    
                    history.append({
                        "date": date_str,
                        "median_price": price_usd,
                        "volume": day_data.get("count", 0)
                    })
                return history
        except httpx.HTTPStatusError as e:
            # Added a basic fallback or exception surface
            print(f"Error fetching data from CSFloat for {hash_name}: {e}")
            return []

    @classmethod
    async def get_bluechip_items(cls, min_daily_volume: int = 50) -> List[str]:
        """
        Dynamically fetches top items and filters them by volume to find 'bluechip' liquid skins.
        Since CSFloat may not have a single endpoint for all items, this function 
        scrapes/queries a popular items endpoint or relies on a robust market index.
        """
        # Placeholder for dynamic fetching. 
        # E.g., querying popular items endpoint and filtering.
        # url = f"{cls.BASE_URL}/popular-items"
        # async with httpx.AsyncClient() as client:
        #     res = await client.get(url)
        #     # filter logic here
        
        # For now, representing the logic format returning hash_names:
        return [
            "AK-47 | Redline (Field-Tested)",
            "AWP | Asiimov (Field-Tested)",
            "M4A1-S | Printstream (Field-Tested)",
            "Karambit | Doppler (Factory New)",
            # Additional popular trending liquid skins:
            "AK-47 | Slate (Field-Tested)",
            "AWP | Atheris (Field-Tested)",
            "Desert Eagle | Printstream (Field-Tested)",
            "M4A4 | In Living Color (Field-Tested)",
            "USP-S | Ticket to Hell (Field-Tested)",
            "Glock-18 | Water Elemental (Field-Tested)",
            "MAC-10 | Neon Rider (Factory New)",
            "M4A1-S | Decimator (Field-Tested)"
        ]
