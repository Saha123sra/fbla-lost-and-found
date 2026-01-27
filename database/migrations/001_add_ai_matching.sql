-- Migration: Add AI Matching Support
-- Run this SQL in your Supabase SQL Editor if you have an existing database

-- Add ai_tags column to requests table (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'requests' AND column_name = 'ai_tags'
    ) THEN
        ALTER TABLE requests ADD COLUMN ai_tags JSONB;
    END IF;
END $$;

-- Ensure items table has ai_tags column (should already exist from original schema)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'items' AND column_name = 'ai_tags'
    ) THEN
        ALTER TABLE items ADD COLUMN ai_tags JSONB;
    END IF;
END $$;

-- Create index for faster AI tag queries
CREATE INDEX IF NOT EXISTS idx_items_ai_tags ON items USING gin(ai_tags);
CREATE INDEX IF NOT EXISTS idx_requests_ai_tags ON requests USING gin(ai_tags);

-- Add trigger to update requests timestamp
DROP TRIGGER IF EXISTS update_requests_timestamp ON requests;
CREATE TRIGGER update_requests_timestamp
    BEFORE UPDATE ON requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Verify columns exist
SELECT
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name IN ('items', 'requests')
  AND column_name = 'ai_tags';
