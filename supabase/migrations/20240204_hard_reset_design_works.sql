-- HARD RESET SCRIPT
-- 1. Drop tables with CASCADE to remove all dependent policies and keys
DROP TABLE IF EXISTS design_projects CASCADE;
DROP TABLE IF EXISTS design_works CASCADE;

-- 2. Force schema cache reload immediately
NOTIFY pgrst, 'reload schema';

-- 3. Recreate table with explicit column definitions
CREATE TABLE design_works (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 4. Re-enable RLS
ALTER TABLE design_works ENABLE ROW LEVEL SECURITY;

-- 5. Re-create policies
CREATE POLICY "Users can view their own works" ON design_works
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own works" ON design_works
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own works" ON design_works
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own works" ON design_works
    FOR DELETE USING (auth.uid() = user_id);

-- 6. Final schema reload notification
NOTIFY pgrst, 'reload schema';
