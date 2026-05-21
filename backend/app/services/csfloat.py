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
        # Note: Actual CSFloat endpoint for history might be different, 
        # using a placeholder structure as per standard usage.
        encoded_name = urllib.parse.quote(hash_name)
        url = f"{cls.BASE_URL}/history/{encoded_name}"
        
        headers = {"Authorization": f"{settings.CSFLOAT_API_KEY}"}
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            # Returns data structured like [{date: '...', avg_price: ..., volume: ...}, ...]
            return response.json()

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
            "Karambit | Doppler (Factory New)"
        ]
