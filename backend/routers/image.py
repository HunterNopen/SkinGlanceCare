from email.mime import image
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.db import schemas
from backend.auth.auth import get_current_user

from backend.db import models
from backend.utils.clear_metadata import clear_metadata
from backend.utils.validate_image import validate_image
from gradio_client import Client, handle_file

from backend.config import GRADIO_URL
from backend.utils.llm_helper import build_gemini_message, CLASS_FULL_NAME

import math
import shutil
import os
import json

router = APIRouter(prefix="/images", tags=["Images"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def get_gradio_client():
    return Client(GRADIO_URL)


@router.get("/history", response_model=list[schemas.ImageOut])
def get_images_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(8, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    images = (
        db.query(models.Image)
        .filter(models.Image.user_id == current_user.id)
        .order_by(models.Image.upload_time.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return images


@router.post(
    "/upload/",
    response_model=schemas.ImageAnalysisResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    validate_image(file)

    file.file.seek(0)

    clear_metadata(file)
    file.file.seek(0)

    filename = f"{current_user.id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        client = get_gradio_client()
        result = client.predict(
            image=handle_file(file_path),
            api_name="/predict_api",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gradio model error: {str(e)}",
        )

    result["predicted_class_full"] = CLASS_FULL_NAME.get(
        result["predicted_class"],
        result["predicted_class"],
    )

    gemini_params = {
        "predicted_class": result.get("predicted_class"),
        "predicted_class_full": result.get("predicted_class_full"),
        "predicted_probability": result.get("predicted_probability"),
        "class_probabilities": result.get("class_probabilities"),
        "certainty_score": result.get("certainty_score"),
        "certainty_level": result.get("certainty_level"),
        "cancer_probability": result.get("cancer_probability"),
        "cancer_certainty": result.get("cancer_certainty"),
        "risk_level": result.get("risk_level"),
        "recommendation": result.get("recommendation"),
        "is_ood": result.get("is_ood"),
        "model_uncertainty": result.get("model_uncertainty"),
    }

    llm_message = build_gemini_message(gemini_params)

    result["llm_message"] = llm_message

    image = models.Image(
        user_id=current_user.id,
        filename=filename,
        status="uploaded",
        result=json.dumps(result, ensure_ascii=False),
    )
    db.add(image)
    db.commit()
    db.refresh(image)

    return schemas.ImageAnalysisResponse(
        image_id=image.id,
        result=result,
    )


@router.get("/{image_id}/llm_message", response_model=schemas.LLMMessageResponse)
def get_llm_message(
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

    try:
        result = json.loads(image.result)
    except Exception:
        result = eval(image.result, {"__builtins__": None}, {})

    label = result.get("label")

    confidences = result.get("confidences", [])
    # confidence_score = _compute_confidence_score(confidences, label)
    # confidence_top3_score = _compute_top3_confidence(confidences)

    llm_message = build_gemini_message(result)

    result["llm_message"] = llm_message

    image.result = json.dumps(result, ensure_ascii=False)
    db.commit()

    return schemas.LLMMessageResponse(image_id=image.id, llm_message=llm_message)


@router.get("/", response_model=list[schemas.ImageBase])
def list_images(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Image)
        .filter(models.Image.user_id == current_user.id)
        .order_by(models.Image.upload_time.desc())
        .all()
    )


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


@router.delete("/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_image(
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

    file_path = os.path.join(UPLOAD_DIR, image.filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    db.delete(image)
    db.commit()

    return
