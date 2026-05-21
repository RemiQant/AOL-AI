import pandas as pd
from typing import Tuple

def prepare_prophet_dataframe(
    historical_prices: list[dict], 
    player_counts: list[dict], 
    game_updates: list[dict]
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Transforms the raw records from Supabase into the exact Pandas DataFrames 
    required by Facebook Prophet.
    
    Returns:
        df_train: DataFrame with columns ['ds', 'y', 'player_count', 'is_market_shocker']
        df_future: DataFrame with columns ['ds', 'player_count', 'is_market_shocker'] for the next 7 days
    """
    
    # 1. Convert historical price data
    df_prices = pd.DataFrame(historical_prices)
    if df_prices.empty:
        raise ValueError("Not enough historical data to map dates.")
        
    df_prices = df_prices[['date', 'median_price']]
    df_prices['date'] = pd.to_datetime(df_prices['date'])
    
    # 2. Convert player counts
    df_players = pd.DataFrame(player_counts)
    if not df_players.empty:
        df_players['date'] = pd.to_datetime(df_players['date'])
        df_players = df_players[['date', 'concurrent_players']]
    else:
        df_players = pd.DataFrame(columns=['date', 'concurrent_players'])
        
    # 3. Convert game updates
    df_news = pd.DataFrame(game_updates)
    if not df_news.empty:
        df_news['date'] = pd.to_datetime(df_news['date'])
        df_news = df_news[['date', 'is_market_shocker']]
        # Consolidate multiple news on the same day by taking the max (True if any is True)
        df_news = df_news.groupby('date', as_index=False).max()
    else:
        df_news = pd.DataFrame(columns=['date', 'is_market_shocker'])
    
    # Merge them all on date
    df = pd.merge(df_prices, df_players, on='date', how='left')
    df = pd.merge(df, df_news, on='date', how='left')
    
    # Handle missing values in regressors (forward fill or defaults)
    df['concurrent_players'] = df['concurrent_players'].ffill().bfill().fillna(500000)
    df['is_market_shocker'] = df['is_market_shocker'].fillna(False).astype(int)
    
    # Prophet requires renaming the core target/date columns
    df = df.rename(columns={'date': 'ds', 'median_price': 'y', 'concurrent_players': 'player_count'})
    df_train = df.sort_values('ds').reset_index(drop=True)
    
    # --- Create Future DataFrame (7 Days) ---
    last_date = df_train['ds'].max()
    future_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=7, freq='D')
    
    # Compute 7-day rolling average for player count to predict the baseline
    # If we have less than 7 days of data, take the mean of what we have.
    rolling_players_avg = df_train['player_count'].tail(7).mean()
    
    df_future = pd.DataFrame({
        'ds': future_dates,
        'player_count': [rolling_players_avg] * 7,
        'is_market_shocker': [0] * 7 # Exclude unexpected shocks from baseline future
    })
    
    return df_train, df_future
