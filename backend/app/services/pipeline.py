import logging
import asyncio
from app.core.database.supabase import supabase
from app.services.steam import SteamWebAPI, SteamNewsAPI
from app.services.csfloat import CSFloatService
from app.ml.data_prep import prepare_prophet_dataframe
from app.ml.predictor import CS2Predictor
from datetime import datetime

logger = logging.getLogger("cs2-predictor.pipeline")

async def run_daily_pipeline():
    """
    This is the main orchestrator that runs asynchronously in the background.
    It fetches daily actuals, runs the AI model, and upserts predictions.
    """
    logger.info("Starting daily ML pipeline in the background...")
    try:
        # 1. Fetch current player count from Steam
        players = await SteamWebAPI.get_current_players()
        logger.info(f"Fetched daily players: {players}")
        
        # Insert today's player count (ignoring conflicts if already fetched today)
        today = datetime.now().date().isoformat()
        try:
            supabase.table("player_counts").insert({
                "date": today,
                "concurrent_players": players
            }).execute()
        except Exception:
            pass # Already exists for today
        
        # 2. Fetch patch notes to find Market Shockers
        news = await SteamNewsAPI.get_recent_news(count=5)
        if news:
            title = news[0].get('title', '')
            contents = news[0].get('contents', '')
            is_shocker = SteamNewsAPI.is_market_shocker(contents, title)
            try:
                supabase.table("game_updates").insert({
                    "date": today,
                    "title": title,
                    "is_market_shocker": is_shocker
                }).execute()
            except Exception:
                pass # Already exists for today
        
        # 3. Fetch bluechip items and process them one by one
        bluechips = await CSFloatService.get_bluechip_items()
        
        for hash_name in bluechips:
            logger.info(f"Processing ML Pipeline for: {hash_name}")
            
            # Ensure the item exists in the database
            item_res = supabase.table("items").select("id").eq("hash_name", hash_name).execute()
            if not item_res.data:
                res = supabase.table("items").insert({"hash_name": hash_name}).execute()
                item_id = res.data[0]['id']
            else:
                item_id = item_res.data[0]['id']
                
            # Fetch latest data from CSFloat
            try:
                history = await CSFloatService.get_historical_prices(hash_name)
                # Prepare prices for insert
                prices_to_insert = []
                for entry in history:
                    prices_to_insert.append({
                        "item_id": item_id,
                        "date": entry["date"],
                        "median_price": entry["median_price"],
                        "volume": entry["volume"]
                    })
                # Upsert all prices at once
                if prices_to_insert:
                    try:
                        # Batch insert ignoring duplicates
                        supabase.table("historical_prices").upsert(prices_to_insert, ignore_duplicates=True).execute()
                    except Exception as e:
                        logger.error(f"Failed to bulk insert prices for {hash_name}: {e}")
            except Exception as e:
                logger.error(f"Failed to fetch CSFloat history for {hash_name}: {e}")
                continue

            # Load 365 Days of Data for Prophet
            hist_req = supabase.table("historical_prices").select("*").eq("item_id", item_id).order("date", desc=True).limit(365).execute()
            players_req = supabase.table("player_counts").select("*").order("date", desc=True).limit(365).execute()
            news_req = supabase.table("game_updates").select("*").order("date", desc=True).limit(365).execute()
            
            # Run Prophet Predictions
            df_train, df_future = prepare_prophet_dataframe(
                historical_prices=hist_req.data,
                player_counts=players_req.data,
                game_updates=news_req.data
            )
            
            if df_train.empty:
                logger.warning(f"Not enough training data for {hash_name}. Skipping...")
                continue
                
            predictor = CS2Predictor()
            df_forecast = predictor.train_and_forecast(df_train, df_future)
            
            # Upsert Predictions
            for _, row in df_forecast.iterrows():
                try:
                    # In production we'd do an upsert
                    supabase.table("ai_predictions").delete().eq("item_id", item_id).eq("target_date", str(row['target_date'].date())).execute()
                    supabase.table("ai_predictions").insert({
                        "item_id": item_id,
                        "target_date": str(row['target_date'].date()),
                        "predicted_price": float(row['predicted_price']),
                        "model_used": "prophet_v1"
                    }).execute()
                except Exception as e:
                    logger.error(f"Failed to save prediction for {hash_name}: {e}")
                    
        logger.info("Daily ML pipeline executed successfully.")
        
    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
