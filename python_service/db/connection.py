import os
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(Path(__file__).parent.parent / ".env")

uri = os.getenv("MONGODB_URI")
if not uri:
    raise RuntimeError("MONGODB_URI environment variable is not set")

client = AsyncIOMotorClient(uri)
db = client.get_default_database()
