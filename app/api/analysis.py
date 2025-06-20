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

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)


    time.sleep(2)

    result = {
        "filename": file.filename,
        "cancer_probability": round(random.uniform(0.01, 0.99), 2),  
        "status": "success"
    }

    return JSONResponse(content=result)
