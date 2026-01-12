from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.db import schemas
from backend.auth.auth import get_current_user

from backend.db import models
from backend.utils.clear_metadata import clear_metadata
from backend.utils.validate_image import validate_image
from gradio_client import Client, handle_file

from backend.config import GRADIO_URL
from backend.llm_helper import build_gemini_message, CLASS_FULL_NAME

import math
import shutil
import os
import json

router = APIRouter(prefix="/images", tags=["Images"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


MODEL_ACCURACY = 0.91

CLASS_ACCURACY = {
    "MEL": 0.77,
    "BKL": 0.88,
    "NV": 0.90,
    "BCC": 0.87,
    "AKIEC": 0.82,
    "DF": 0.85,
    "VASC": 0.88,
    "HEAL": 0.99,
}

CLASS_PREVALENCE = {
    "MEL": 0.02,
    "BKL": 0.10,
    "NV": 0.50,
    "BCC": 0.05,
    "AKIEC": 0.03,
    "DF": 0.03,
    "VASC": 0.02,
    "HEAL": 0.25,
}


def get_gradio_client():
    return Client(GRADIO_URL)


def _compute_confidence_score(confidences, label: str):
    if not confidences:
        return 0.0

    probs = [float(c.get("confidence", 0.0)) for c in confidences]
    probs = [p for p in probs if p > 0.0]
    if not probs:
        return 0.0

    probs_sorted = sorted(probs, reverse=True)
    p1 = probs_sorted[0]

    overall_acc = MODEL_ACCURACY
    class_acc = CLASS_ACCURACY.get(label, overall_acc)
    prevalence = CLASS_PREVALENCE.get(label, 0.1)

    numerator = p1 * class_acc * prevalence
    denom = numerator + (1.0 - p1) * max(1e-3, (1.0 - prevalence)) * (1.0 - overall_acc)
    posterior = numerator / denom if denom > 0 else p1

    raw_score = 0.8 * posterior + 0.2 * overall_acc
    raw_score = max(0.0, min(raw_score, 1.0))
    return raw_score * 100.0


def _compute_top3_confidence(confidences):
    if not confidences:
        return 0.0

    top3 = sorted(
        [float(c.get("confidence", 0.0)) for c in confidences],
        reverse=True,
    )[:3]

    if not top3:
        return 0.0

    p1 = top3[0]
    p2 = top3[1] if len(top3) > 1 else 0.0
    p3 = top3[2] if len(top3) > 2 else 0.0

    mass_top3 = p1 + p2 + p3
    margin12 = p1 - p2

    eps = 1e-12
    entropy_top3 = -sum(p * math.log(p + eps) for p in [p1, p2, p3] if p > 0)
    max_entropy_top3 = math.log(3.0)
    entropy_norm_top3 = entropy_top3 / max_entropy_top3 if max_entropy_top3 > 0 else 0.0
    certainty_top3 = 1.0 - entropy_norm_top3

    raw = 0.4 * mass_top3 + 0.4 * margin12 + 0.2 * certainty_top3
    raw = max(0.0, min(raw, 1.0))

    return raw * 100.0


# @router.post(
#     "/upload/",
#     response_model=schemas.ImageAnalysisResponse,
#     status_code=status.HTTP_201_CREATED,
# )
# def upload_image(
#     file: UploadFile = File(...),
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(get_current_user),
# ):

#     validate_image(file)
#     clear_metadata(file)

#     filename = f"{current_user.id}_{file.filename}"
#     file_path = os.path.join(UPLOAD_DIR, filename)

#     with open(file_path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     try:
#         client = get_gradio_client()
#         result = client.predict(
#             image=handle_file(file_path),
#             api_name="/predict_openvino",
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Gradio model error: {str(e)}")

#     if not isinstance(result, dict) or "label" not in result:
#         raise HTTPException(status_code=500, detail="Unexpected model result format")

#     label = result.get("label")
#     confidences = result.get("confidences", [])

#     predicted_probability = 0.0
#     if confidences:
#         predicted_probability = float(confidences[0].get("confidence", 0.0))

#     confidence_score = _compute_confidence_score(confidences, label)
#     confidence_top3_score = _compute_top3_confidence(confidences)


#     image = models.Image(
#         user_id=current_user.id,
#         filename=filename,
#         status="uploaded",
#         result=json.dumps(result),
#     )
#     db.add(image)
#     db.commit()
#     db.refresh(image)

#     predicted_class_full = CLASS_FULL_NAME.get(label, label)

#     response_confidences = [
#         schemas.ImagePredictionConfidence(
#             label=item.get("label", "?"),
#             confidence=float(item.get("confidence", 0.0)),
#         )
#         for item in confidences
#     ]

#     return schemas.ImageAnalysisResponse(
#         image_id=image.id,
#         predicted_class=label,
#         predicted_class_full=predicted_class_full,
#         predicted_probability=predicted_probability,
#         confidence_score=confidence_score,
#         confidence_top3_score=confidence_top3_score,
#         confidences=response_confidences,
#     )


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

    # Walidacja i czyszczenie metadata
    validate_image(file)
    clear_metadata(file)

    filename = f"{current_user.id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Wywołanie modelu Gradio
    try:
        client = get_gradio_client()
        result = client.predict(
            image=handle_file(file_path),
            api_name="/predict_openvino",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gradio model error: {str(e)}")

    if not isinstance(result, dict) or "label" not in result:
        raise HTTPException(status_code=500, detail="Unexpected model result format")

    label = result.get("label")
    confidences = result.get("confidences", [])

    # Obliczenie metryk
    predicted_probability = float(confidences[0]["confidence"]) if confidences else 0
    confidence_score = _compute_confidence_score(confidences, label)
    confidence_top3_score = _compute_top3_confidence(confidences)

    # Dodanie metryk do zapisywanego JSONa
    result["predicted_class_full"] = CLASS_FULL_NAME.get(label, label)
    result["predicted_probability"] = predicted_probability
    result["confidence_score"] = confidence_score
    result["confidence_top3_score"] = confidence_top3_score

    # Zapis do bazy
    image = models.Image(
        user_id=current_user.id,
        filename=filename,
        status="uploaded",
        result=json.dumps(result),  # <-- pełny wynik
    )
    db.add(image)
    db.commit()
    db.refresh(image)

    # Przygotowanie odpowiedzi API
    response_confidences = [
        schemas.ImagePredictionConfidence(
            label=item.get("label", "?"),
            confidence=float(item.get("confidence", 0.0)),
        )
        for item in confidences
    ]

    return schemas.ImageAnalysisResponse(
        image_id=image.id,
        predicted_class=label,
        predicted_class_full=result["predicted_class_full"],
        predicted_probability=predicted_probability,
        confidence_score=confidence_score,
        confidence_top3_score=confidence_top3_score,
        confidences=response_confidences,
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
    confidence_score = _compute_confidence_score(confidences, label)
    confidence_top3_score = _compute_top3_confidence(confidences)

    llm_message = build_gemini_message(result, confidence_score, confidence_top3_score)

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


# @router.delete("/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_image(
#     image_id: int,
#     db: Session = Depends(get_db),
#     current_user: models.User = Depends(get_current_user),
# ):
#     image = (
#         db.query(models.Image)
#         .filter(models.Image.id == image_id, models.Image.user_id == current_user.id)
#         .first()
#     )

#     if not image:
#         raise HTTPException(status_code=404, detail="Image not found or access denied")

#     file_path = os.path.join(UPLOAD_DIR, image.filename)
#     if os.path.exists(file_path):
#         os.remove(file_path)

#     db.delete(image)
#     db.commit()

#     return status.HTTP_200_OK


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
