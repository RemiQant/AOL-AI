from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client:
    """
    Initializes and returns a Supabase Python client using connection 
    strings provided in environment variables.
    """
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

# A global singular instance to be imported and used across services
supabase: Client = get_supabase_client()
