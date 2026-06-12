-- The pipeline now stores separate predictions per model (prophet_v1, lstm_v1)
-- for the same item/date, so the unique constraint must include model_used.
ALTER TABLE ai_predictions DROP CONSTRAINT IF EXISTS ai_predictions_item_id_target_date_key;
ALTER TABLE ai_predictions ADD CONSTRAINT ai_predictions_item_id_target_date_model_key UNIQUE (item_id, target_date, model_used);
