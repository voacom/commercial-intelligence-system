-- Create design_projects table
CREATE TABLE IF NOT EXISTS design_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'manual', 'poster', etc.
    title VARCHAR(255) NOT NULL,
    content JSONB, -- Stores the slides or other project data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE design_projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own projects
CREATE POLICY "Users can view their own projects" ON design_projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON design_projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON design_projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON design_projects
    FOR DELETE USING (auth.uid() = user_id);
