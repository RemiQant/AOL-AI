# Project Handoff: CS2 Bluechip Price Predictor

## 📖 Project Overview
A machine learning-powered forecasting application that predicts CS2 "bluechip" (highly liquid) skin prices.
* **Backend:** Python, FastAPI, Supabase (PostgreSQL), Facebook Prophet (ML Engine).
* **Frontend:** React + Vite, TailwindCSS, Recharts (Pending).
* **Architecture Rules:** The AI pipeline is heavyweight, so it is triggered via a secure GitHub Actions Webhook (`daily_sync.yml`) that runs in a FastAPI `BackgroundTask`. This avoids PaaS HTTP timeout limits. No pure Serverless/FaaS (like Vercel functions for the backend) due to Prophet's size.

## ✅ What Has Been Completed (Phases 1-4)
1. **DB & Core Infrastructure:**
   * Supabase integration operates seamlessly (`/backend/app/core/database/supabase.py`).
   * `.env` handles connections (`SUPABASE_URL`, `SUPABASE_KEY`, `GITHUB_WEBHOOK_SECRET`).
   * Pydantic schemas created for strict API responses.
2. **Services (Ingestion):**
   * Steam Web API (Syncs live concurrent player counts).
   * Steam News API (Parses patch notes to flag `is_market_shocker`).
   * CSFloat API (Currently holds a list of 10+ bluechip skins. **Note:** The `get_historical_prices` function is temporarily returning mock data because the exact CSFloat endpoint is undocumented/404ing). 
3. **AI Pipeline (Facebook Prophet):** 
   * Preprocessor converts raw DB data into Prophet's `[ds, y, player_count, is_market_shocker]` matrix and computes 7-day rolling averages for future parameters.
   * Prophet trains and outputs a 7-day forecast.
   * `run_daily_pipeline()` automates everything from fetching to DB upserts.
4. **FastAPI Endpoints:**
   * `GET /api/v1/skins/{hash_name}`: Ready for frontend. Returns structured JSON containing 30 days of history and 7 days of predictions.
   * `POST /api/v1/webhooks/daily-sync`: Webhook securely receives GitHub Actions triggers.
5. **Testing & EDA:**
   * `backend/test_ml_pipeline.py`: Seeds the DB with an item and generates a full test pipeline flow.
   * `backend/test_services.py`: Validates network connections and API functionality.
   * `backend/notebooks/Preprocessing_and_EDA.ipynb`: Working Jupyter notebook for visualization and ML checks.

## 🚀 Next Steps (Where the next session should begin)
1. **Finalize 3rd Party APIs (Specifically CSFloat):**
   * Investigate CSFloat's real historical pricing API to get actual live market data.
   * Remove the mock loop in `backend/app/services/csfloat.py` -> `get_historical_prices()` and replace it with the precise live HTTP request.
   * Make sure every 3rd party API (Steam Players, Steam News, CSFloat) works properly and parses actual data.
2. **End-to-End Live AI Testing:**
   * Test the live pipeline using the actual endpoints (no mock data). 
   * Ensure Prophet correctly parses the raw market data, computes the forecasts, and correctly upserts to the database without pipeline breaks.
3. **GitHub Actions Scripts (Fetching/Backfilling):**
   * Finalize the GitHub Actions workflow intended for fetching the data.
   * If necessary, build an initial backfill script or workflow that pulls the last 365 days of data on day 1 so the AI has enough history to train on fully.
4. **Deployment:**
   * Deploy the `/backend` folder to a containerized PaaS (e.g., Render Web Services, Leapcell).
   * Add the live `PRODUCTION_API_URL` to the GitHub repository secrets so the `.github/workflows/daily_sync.yml` can begin automating the pipeline.
5. **Phase 5 (Frontend - Deferred):**
   * Only after the backend and AI engine are 100% verified with live data, move to building the React + Vite charting dashboard in the `/frontend` directory.

## 💻 How to develop locally
From the `/backend` directory:
* **Start API:** `uv run uvicorn app.main:app --reload`
* **Test ML & Seed DB:** `uv run python test_ml_pipeline.py`
* **Verify 3rd Party APIs:** `uv run python test_services.py` 
* **Swagger UI Docs:** http://127.0.0.1:8000/docs
