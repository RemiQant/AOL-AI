from pydantic_settings import BaseSettings, SettingsConfigDict
import os

# Determine which env file to use based on an environment variable, defaults to .env.development
ENV_FILE = os.getenv("ENV_FILE", ".env/.env.development")

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_KEY: str
    CSFLOAT_API_KEY: str
    
    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
