from dotenv import load_dotenv
import os

load_dotenv()
url = os.getenv("DATABASE_URL")
print("RAW:", repr(url))