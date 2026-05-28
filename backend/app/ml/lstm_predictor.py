import pandas as pd
import numpy as np
from typing import Tuple
import logging
from sklearn.preprocessing import MinMaxScaler
from tensorflow import keras
from tensorflow.keras import layers

logger = logging.getLogger("cs2-predictor.ml")


class CS2LSTMPredictor:
    """
    LSTM-based time series forecaster for CS2 skin prices.
    Mirrors the interface of CS2Predictor (Prophet) for easy integration.
    """
    
    def __init__(self, lookback_window: int = 14, epochs: int = 50, verbose: int = 0):
        """
        Initialize LSTM predictor.
        
        Args:
            lookback_window: Number of previous days to use for sequence prediction
            epochs: Training epochs
            verbose: Keras verbosity level (0=silent, 1=progress bar, 2=one line per epoch)
        """
        self.lookback_window = lookback_window
        self.epochs = epochs
        self.verbose = verbose
        self.model = None
        self.price_scaler = MinMaxScaler(feature_range=(0, 1))
        self.regressor_scaler = MinMaxScaler(feature_range=(0, 1))
        
    def _create_sequences(
        self, 
        prices: np.ndarray, 
        regressors: np.ndarray, 
        lookback: int
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
        """
        Create sequences for LSTM training.
        
        Args:
            prices: 1D array of normalized prices
            regressors: 2D array of normalized regressor features (player_count, is_market_shocker)
            lookback: Window size
            
        Returns:
            X_sequences: Input sequences (samples, lookback, features)
            y_sequences: Target prices
            dates_idx: Indices for date tracking
        """
        X_sequences = []
        y_sequences = []
        dates_idx = []
        
        for i in range(len(prices) - lookback):
            # Stack price with regressors
            seq = np.column_stack([
                prices[i:i + lookback].reshape(-1, 1),
                regressors[i:i + lookback]
            ])
            X_sequences.append(seq)
            y_sequences.append(prices[i + lookback])
            dates_idx.append(i + lookback)
            
        return np.array(X_sequences), np.array(y_sequences), np.array(dates_idx)
    
    def train_and_forecast(self, df_train: pd.DataFrame, df_future: pd.DataFrame) -> pd.DataFrame:
        """
        Train LSTM model and generate 7-day forecast with uncertainty bounds.
        
        Args:
            df_train: Training DataFrame with columns ['ds', 'y', 'player_count', 'is_market_shocker']
            df_future: Future DataFrame with columns ['ds', 'player_count', 'is_market_shocker']
            
        Returns:
            Forecast DataFrame with columns ['ds', 'yhat', 'yhat_lower', 'yhat_upper']
        """
        logger.info(f"Training LSTM model on {len(df_train)} historical records...")
        
        # Extract and normalize price data
        prices = df_train['y'].values.reshape(-1, 1)
        prices_normalized = self.price_scaler.fit_transform(prices)
        
        # Extract and normalize regressor features
        regressors = df_train[['player_count', 'is_market_shocker']].values
        regressors_normalized = self.regressor_scaler.fit_transform(regressors)
        
        # Create sequences
        X_train, y_train, _ = self._create_sequences(
            prices_normalized.flatten(),
            regressors_normalized,
            self.lookback_window
        )
        
        if len(X_train) < 5:
            logger.warning("Not enough data for LSTM training. Need at least lookback_window + 5 samples.")
            # Return dummy forecast if insufficient data
            return pd.DataFrame({
                'ds': df_future['ds'],
                'yhat': [df_train['y'].mean()] * len(df_future),
                'yhat_lower': [df_train['y'].mean() * 0.9] * len(df_future),
                'yhat_upper': [df_train['y'].mean() * 1.1] * len(df_future)
            })
        
        # Build LSTM model
        num_features = X_train.shape[2]  # price + 2 regressors = 3
        self.model = keras.Sequential([
            layers.LSTM(64, activation='relu', input_shape=(self.lookback_window, num_features), return_sequences=True),
            layers.Dropout(0.2),
            layers.LSTM(32, activation='relu', return_sequences=False),
            layers.Dropout(0.2),
            layers.Dense(16, activation='relu'),
            layers.Dense(1)
        ])
        
        self.model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        
        # Train model
        self.model.fit(
            X_train, y_train,
            epochs=self.epochs,
            batch_size=8,
            verbose=self.verbose,
            validation_split=0.2
        )
        
        # Prepare future sequences for forecasting
        logger.info(f"Forecasting for the next {len(df_future)} days...")
        
        # Get the last lookback_window days from training data
        last_prices = prices_normalized[-self.lookback_window:].copy()
        last_regressors = regressors_normalized[-self.lookback_window:].copy()
        
        forecasts = []
        forecast_std = []  # For uncertainty bounds
        
        # Predict day by day, using previous predictions for next input
        for idx, future_row in df_future.iterrows():
            # Create current sequence
            current_seq = np.column_stack([
                last_prices,
                last_regressors
            ]).reshape(1, self.lookback_window, num_features)
            
            # Predict
            pred_normalized = self.model.predict(current_seq, verbose=0)[0][0]
            pred_price = self.price_scaler.inverse_transform([[pred_normalized]])[0][0]
            
            forecasts.append(pred_price)
            
            # Update the rolling window with predicted price and future regressor values
            new_regressor = future_row[['player_count', 'is_market_shocker']].values.reshape(1, -1)
            new_regressor_normalized = self.regressor_scaler.transform(new_regressor)[0]
            
            last_prices = np.vstack([last_prices[1:], [[pred_normalized]]])
            last_regressors = np.vstack([last_regressors[1:], [new_regressor_normalized]])
            
            # Estimate uncertainty (simple approach: 10% of predicted price)
            forecast_std.append(max(pred_price * 0.1, 0.5))
        
        # Ensure predictions aren't negative
        forecasts = np.array(forecasts).clip(min=0.01)
        forecast_std = np.array(forecast_std)
        
        # Build forecast dataframe
        df_forecast = pd.DataFrame({
            'ds': df_future['ds'],
            'yhat': forecasts,
            'yhat_lower': forecasts - 1.96 * forecast_std,  # 95% confidence interval
            'yhat_upper': forecasts + 1.96 * forecast_std
        })
        
        df_forecast['yhat_lower'] = df_forecast['yhat_lower'].clip(lower=0.01)
        
        logger.info("LSTM forecast completed successfully.")
        
        return df_forecast
