from google import genai
from core.config import settings

if settings.GEMINI_API_KEY:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
else:
    client = None
    print("WARNING: GEMINI_API_KEY not found in .env.local. Refactoring agent will be disabled.")