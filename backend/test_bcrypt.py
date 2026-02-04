import bcrypt

password = b"admin123"
hashed = b"$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW"

try:
    if bcrypt.checkpw(password, hashed):
        print("Password match!")
    else:
        print("Password does not match.")
except Exception as e:
    print(f"Error: {e}")
