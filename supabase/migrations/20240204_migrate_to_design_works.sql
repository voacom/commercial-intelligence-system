-- Create design_works table (matching design_projects structure)
CREATE TABLE IF NOT EXISTS design_works (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE design_works ENABLE ROW LEVEL SECURITY;

-- Create policies for design_works
DROP POLICY IF EXISTS "Users can view their own works" ON design_works;
DROP POLICY IF EXISTS "Users can insert their own works" ON design_works;
DROP POLICY IF EXISTS "Users can update their own works" ON design_works;
DROP POLICY IF EXISTS "Users can delete their own works" ON design_works;

CREATE POLICY "Users can view their own works" ON design_works
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own works" ON design_works
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own works" ON design_works
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own works" ON design_works
    FOR DELETE USING (auth.uid() = user_id);

-- Drop old table if exists to avoid confusion
DROP TABLE IF EXISTS design_projects;

-- Refresh schema just in case
NOTIFY pgrst, 'reload schema';
