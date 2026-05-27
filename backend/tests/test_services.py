import asyncio
from app.core.config import settings
from app.core.database.supabase import supabase
from app.services.steam import SteamWebAPI, SteamNewsAPI
from app.services.csfloat import CSFloatService

async def main():
    print("=== Testing Core Configuration ===")
    print(f"Loaded Supabase URL: {settings.SUPABASE_URL[:15]}...")
    print("")

    print("=== Testing Supabase Connection ===")
    try:
        # Try fetching from the items table to verify connection + schema
        res = supabase.table("items").select("*").limit(1).execute()
        print(f"✅ Supabase connection successful! Data: {res.data}")
    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")
    print("")

    print("=== Testing Steam Web API ===")
    try:
        players = await SteamWebAPI.get_current_players()
        print(f"✅ Current CS2 Players: {players}")
    except Exception as e:
        print(f"❌ Steam Web API failed: {e}")
    print("")

    print("=== Testing Steam News API ===")
    try:
        news = await SteamNewsAPI.get_recent_news(count=2)
        print(f"✅ Fetched {len(news)} recent news items.")
        if news:
            title = news[0].get('title', '')
            contents = news[0].get('contents', '')
            shocker = SteamNewsAPI.is_market_shocker(contents, title)
            print(f"Latest News Title: {title}")
            print(f"Is Market Shocker? {shocker}")
    except Exception as e:
        print(f"❌ Steam News API failed: {e}")
    print("")

    print("=== Testing CSFloat Service ===")
    try:
        bluechips = await CSFloatService.get_bluechip_items()
        print(f"✅ Fetched bluechip items: {bluechips}")
        
        print("Testing a historical price fetch (this might 404/401 since it's a placeholder endpoint)")
        try:
            history = await CSFloatService.get_historical_prices(bluechips[0])
            print(f"✅ Fetched history: {history}")
        except Exception as e:
            print(f"⚠️ History fetch returned an expected error (since endpoint is a placeholder): {e}")

    except Exception as e:
        print(f"❌ CSFloat Service failed: {e}")
    print("")


if __name__ == "__main__":
    asyncio.run(main())
