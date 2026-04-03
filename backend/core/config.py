import os
from dotenv import load_dotenv

load_dotenv(".env.local")

class Settings:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    DEMO_MODE = os.getenv("DEMO_MODE", "True").lower() == "true"

settings = Settings()