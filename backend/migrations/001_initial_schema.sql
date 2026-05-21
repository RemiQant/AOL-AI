-- migrations/001_initial_schema.sql
-- Run this in the Supabase SQL editor to scaffold the database.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define the CS2 Liquid Skins
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hash_name VARCHAR UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CSFloat Data: Daily price and volume
CREATE TABLE IF NOT EXISTS historical_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    median_price DECIMAL NOT NULL,
    volume INT NOT NULL,
    UNIQUE (item_id, date)
);

-- Steam Web API: Daily Player Count
CREATE TABLE IF NOT EXISTS player_counts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL,
    concurrent_players INT NOT NULL
);

-- Steam News API: Market Shocks
CREATE TABLE IF NOT EXISTS game_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL,
    title VARCHAR NOT NULL,
    is_market_shocker BOOLEAN DEFAULT FALSE -- True if keywords like "Case" or "Operation" found
);

-- AI Output: The forecasted future prices
CREATE TABLE IF NOT EXISTS ai_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    target_date DATE NOT NULL,
    predicted_price DECIMAL NOT NULL,
    model_used VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (item_id, target_date)
);
