from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import shutil
import random
import time
from PIL import Image
import torch
from torchvision import transforms
import os

from model.architectures.efficientnet_model import EfficientNetV2Model

router = APIRouter()
device = 'cuda' if torch.cuda.is_available() else 'cpu'
disease_mapping = {
    0: "MEL",
    1: "MEL",
    2: "NV",
    3: "BCC",
    4: "AKIEC",
    5: "BKL",
    6: "DF",
    7: "VASC",
    8: "HEAL"
}

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    model = await load_model('D:\Python\projects\self\checkpoints\ef_model.cpkt', device)
    model.eval()

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    image = get_transform_image(file_path, device)
    
    with torch.no_grad():
        result = model.forward(image)
        probabilities = torch.softmax(result, dim=1)
        predicted_disease = torch.argmax(probabilities, dim=1).item()
        predicted_probability = probabilities[0, predicted_disease].item() 


    result = {
        "filename": file.filename,
        "disease": disease_mapping.get(predicted_disease, 'Unknown'),
        "probability": f'{(predicted_probability * 100):.2f}%',
        "status": "success"
    }

    return JSONResponse(content=result)

async def load_model(path: str, device: str):
    return EfficientNetV2Model.load_from_checkpoint(path, map_location=device).to(device)

def get_transform_image(path: str, device: str):
    image = Image.open(path).convert("RGB")
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    return transform(image).unsqueeze(0).to(device)