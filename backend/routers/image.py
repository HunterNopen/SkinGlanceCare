from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, schemas
from backend.auth import get_current_user

from gradio_client import Client, handle_file

from backend.config import GRADIO_URL

import shutil
import os

router = APIRouter(prefix="/images", tags=["Images"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def get_gradio_client():
    return Client(GRADIO_URL)


@router.post(
    "/upload/", response_model=schemas.ImageBase, status_code=status.HTTP_201_CREATED
)
def upload_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    filename = f"{current_user.id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        client = get_gradio_client()
        result = client.predict(
            image=handle_file(file_path),
            api_name="/predict_openvino",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gradio model error: {str(e)}")

    image = models.Image(
        user_id=current_user.id,
        filename=filename,
        status="uploaded",
        result=str(result),
    )
    db.add(image)
    db.commit()
    db.refresh(image)

    return image


@router.get("/{image_id}", response_model=schemas.ImageBase)
def get_image_status(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    image = (
        db.query(models.Image)
        .filter(models.Image.id == image_id, models.Image.user_id == current_user.id)
        .first()
    )

    if not image:
        raise HTTPException(status_code=404, detail="Image not found or access denied")

    return image
