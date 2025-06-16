from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import shutil
import random
import time
import torch
import os

from model.architectures.efficientnet_model import EfficientNetV2Model

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    model = load_model('D:\Python\projects\self\checkpoints\ef_model.cpkt')
    with torch.no_grad:
        result = model.forward(file.unsqueeze(0))

    # Zapisz plik tymczasowo
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ⏱️ Symulacja opóźnienia jakby to był model AI
    #time.sleep(2)

    # 🧠 Symulacja analizy — losowy wynik "czy rak"
    result = {
        "filename": file.filename,
        "cancer_probability": result, #round(random.uniform(0.01, 0.99), 2),  # % szans na raka
        "status": "success"
    }

    return JSONResponse(content=result)

def load_model(path: str):
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    return EfficientNetV2Model.load_from_checkpoint(path, map_location=device).to(device)