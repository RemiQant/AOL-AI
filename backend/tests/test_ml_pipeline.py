import asyncio
import logging
from datetime import datetime, timedelta
import random

from app.core.database.supabase import supabase
from app.ml.data_prep import prepare_prophet_dataframe
from app.ml.predictor import CS2Predictor
from app.ml.lstm_predictor import CS2LSTMPredictor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("test_pipeline")

async def run_pipeline_test():
    logger.info("Starting ML Pipeline Integration Test...")

    # 1. Clean up & Insert a Mock Item
    mock_hash_name = "AK-47 | AI Test (Factory New)"
    
    # Delete if exists to prevent unique constraint errors
    supabase.table("items").delete().eq("hash_name", mock_hash_name).execute()
    
    item_res = supabase.table("items").insert({"hash_name": mock_hash_name}).execute()
    item_id = item_res.data[0]['id']
    logger.info(f"Created Mock Item: {item_id}")

    # 2. Generate 30 days of Mock Data
    today = datetime.now()
    dates = [(today - timedelta(days=i)).date() for i in range(30, 0, -1)]
    
    prices = []
    players = []
    
    base_price = 150.0
    for d in dates:
        # Add random walk to price
        base_price += random.uniform(-2.0, 2.0)
        prices.append({
            "item_id": item_id,
            "date": str(d),
            "median_price": round(base_price, 2),
            "volume": random.randint(10, 50)
        })
        
        players.append({
            "date": str(d),
            "concurrent_players": int(700000 + random.uniform(-50000, 50000))
        })

    logger.info("Inserting mock historical records into DB...")
    
    # We ignore constraint errors for players if dates overlap from previous tests
    for p in players:
        try:
            supabase.table("player_counts").insert(p).execute()
        except:
            pass # Date already exists

    supabase.table("historical_prices").insert(prices).execute()
    
    # Add a market shocker 5 days ago
    try:
        shocker_date = str(dates[-5])
        supabase.table("game_updates").insert({
            "date": shocker_date,
            "title": "Operation Bloodhound Test",
            "is_market_shocker": True
        }).execute()
    except:
        pass

    # 3. Read data back from DB (Simulating what the cron job does)
    logger.info("Querying data for ML Prep...")
    hist_req = supabase.table("historical_prices").select("*").eq("item_id", item_id).execute()
    players_req = supabase.table("player_counts").select("*").in_("date", [str(d) for d in dates]).execute()
    news_req = supabase.table("game_updates").select("*").in_("date", [str(d) for d in dates]).execute()

    # 4. Prepare dataframes
    df_train, df_future = prepare_prophet_dataframe(
        historical_prices=hist_req.data,
        player_counts=players_req.data,
        game_updates=news_req.data
    )
    
    logger.info(f"DataFrame Train Shape: {df_train.shape}")
    logger.info(f"DataFrame Future Shape: {df_future.shape}")
    
    # 5. Run Prophet
    logger.info("Training Prophet model...")
    prophet_predictor = CS2Predictor()
    df_prophet_forecast = prophet_predictor.train_and_forecast(df_train, df_future)
    
    # 6. Run LSTM
    logger.info("Training LSTM model...")
    lstm_predictor = CS2LSTMPredictor(lookback_window=14, epochs=30, verbose=0)
    df_lstm_forecast = lstm_predictor.train_and_forecast(df_train, df_future)
    
    # 7. Save Prophet predictions to AI Predictions
    logger.info("Saving Prophet predictions to Supabase...")
    prophet_predictions = []
    for _, row in df_prophet_forecast.iterrows():
        prophet_predictions.append({
            "item_id": item_id,
            "target_date": str(row['target_date'].date()),
            "predicted_price": float(row['predicted_price']),
            "model_used": "prophet_v1"
        })
    supabase.table("ai_predictions").insert(prophet_predictions).execute()
    
    # 8. Save LSTM predictions to AI Predictions
    logger.info("Saving LSTM predictions to Supabase...")
    lstm_predictions = []
    for _, row in df_lstm_forecast.iterrows():
        lstm_predictions.append({
            "item_id": item_id,
            "target_date": str(row['ds'].date()),
            "predicted_price": float(row['yhat']),
            "model_used": "lstm_v1"
        })
    supabase.table("ai_predictions").insert(lstm_predictions).execute()
    
    # 9. Final Verify - Show both models
    final_res = supabase.table("ai_predictions").select("*").eq("item_id", item_id).execute()
    logger.info(f"Success! Found {len(final_res.data)} predictions from both models.")
    
    # Group by model
    prophet_preds = [p for p in final_res.data if p['model_used'] == 'prophet_v1']
    lstm_preds = [p for p in final_res.data if p['model_used'] == 'lstm_v1']
    
    print("\n📊 Prophet V1 Predictions:")
    for row in sorted(prophet_preds, key=lambda x: x['target_date']):
        print(f" -> {row['target_date']}: ${row['predicted_price']:.2f}")
    
    print("\n🔮 LSTM V1 Predictions:")
    for row in sorted(lstm_preds, key=lambda x: x['target_date']):
        print(f" -> {row['target_date']}: ${row['predicted_price']:.2f}")

if __name__ == "__main__":
    asyncio.run(run_pipeline_test())
