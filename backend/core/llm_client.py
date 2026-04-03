from google import genai
from backend.core.config import settings

client = None

if settings.GEMINI_API_KEY:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
else:
    print("WARNING: GEMINI_API_KEY not found in .env.local.")