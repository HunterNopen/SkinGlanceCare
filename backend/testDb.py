import psycopg2
from dotenv import load_dotenv
import os
from dotenv import find_dotenv

load_dotenv()
print(">>> LOADED .env FROM:", find_dotenv())
DATABASE_URL = os.getenv("DATABASE_URL")

print("DATABASE_URL:", DATABASE_URL)

try:
    conn = psycopg2.connect(DATABASE_URL)
    print("✅ Połączono z bazą!")
except Exception as e:
    print("❌ Błąd połączenia:", e)