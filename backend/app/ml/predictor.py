import pandas as pd
from prophet import Prophet
import logging

logger = logging.getLogger("cs2-predictor.ml")

class CS2Predictor:
    def __init__(self):
        # We assume daily data without much yearly seasonality since we mostly look at short-mid term
        self.model = Prophet(
            daily_seasonality=False,   
            yearly_seasonality=True,   
            weekly_seasonality=True
        )
        # Add our custom regressors
        self.model.add_regressor('player_count')
        self.model.add_regressor('is_market_shocker')

    def train_and_forecast(self, df_train: pd.DataFrame, df_future: pd.DataFrame) -> pd.DataFrame:
        """
        Takes the prepared training data, fits the Prophet model, 
        and predicts prices for the 7-day future dataframe.
        """
        logger.info(f"Training Prophet model on {len(df_train)} historical records...")
        
        # Fit the historical data (Silent logging for Stan)
        self.model.fit(df_train)
        
        logger.info(f"Forecasting for the next {len(df_future)} days...")
        # Prophet predict returns a dataframe with 'yhat' (prediction), along with bounds
        forecast = self.model.predict(df_future)
        
        # We only really care about the date (ds) and the predicted price (yhat)
        df_forecast = forecast[['ds', 'yhat']].copy()
        df_forecast = df_forecast.rename(columns={'ds': 'target_date', 'yhat': 'predicted_price'})
        
        # Ensure predictions aren't fundamentally broken (e.g. going negative)
        df_forecast['predicted_price'] = df_forecast['predicted_price'].clip(lower=0.01).round(2)
        
        return df_forecast
