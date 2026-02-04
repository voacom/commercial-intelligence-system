-- Ensure design_projects table exists
CREATE TABLE IF NOT EXISTS design_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE design_projects ENABLE ROW LEVEL SECURITY;

-- Re-create policies (drop first to avoid errors)
DROP POLICY IF EXISTS "Users can view their own projects" ON design_projects;
DROP POLICY IF EXISTS "Users can insert their own projects" ON design_projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON design_projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON design_projects;

CREATE POLICY "Users can view their own projects" ON design_projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON design_projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON design_projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON design_projects
    FOR DELETE USING (auth.uid() = user_id);

-- Force refresh schema cache
NOTIFY pgrst, 'reload schema';
