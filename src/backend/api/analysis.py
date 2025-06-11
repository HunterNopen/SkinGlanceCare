from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import shutil
import os
import random
import time

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    # Zapisz plik tymczasowo
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ⏱️ Symulacja opóźnienia jakby to był model AI
    time.sleep(2)

    # 🧠 Symulacja analizy — losowy wynik "czy rak"
    result = {
        "filename": file.filename,
        "cancer_probability": round(random.uniform(0.01, 0.99), 2),  # % szans na raka
        "status": "success"
    }

    return JSONResponse(content=result)
