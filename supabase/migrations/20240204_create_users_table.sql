-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    hashed_password TEXT NOT NULL,
    disabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial admin user
INSERT INTO users (username, email, full_name, hashed_password, disabled)
VALUES (
    'admin@czbank.com',
    'admin@czbank.com',
    'CZBank Admin',
    '$2b$12$N3qEjLeSY5clOn4/kILzIu4isflwlLUIBSvIzGlEI7ogTVaB9lw3.',
    FALSE
) ON CONFLICT (username) DO NOTHING;
