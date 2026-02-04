-- FORCE SCHEMA CACHE RELOAD BY ALTERING TABLE
-- This is a trick to force PostgREST to refresh its cache for the table
ALTER TABLE design_works ADD COLUMN IF NOT EXISTS _schema_refresh_trigger BOOLEAN DEFAULT FALSE;
ALTER TABLE design_works DROP COLUMN _schema_refresh_trigger;

-- Notify again
NOTIFY pgrst, 'reload schema';
