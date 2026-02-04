from database import supabase

response = supabase.table("users").select("email, role").execute()
print(response.data)
