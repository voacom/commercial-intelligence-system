-- Insert initial admin user into existing users table
INSERT INTO users (email, name, password_hash, role)
VALUES (
    'admin@czbank.com',
    'CZBank Admin',
    '$2b$12$N3qEjLeSY5clOn4/kILzIu4isflwlLUIBSvIzGlEI7ogTVaB9lw3.',
    'admin'
) ON CONFLICT (email) DO NOTHING;
