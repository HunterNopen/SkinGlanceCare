from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from backend.auth.utils import hash_password
from backend.db.database import get_db
from backend.db import schemas
from backend.auth.auth import get_current_user


from backend.db import models
from backend.utils.clear_metadata import clear_metadata
from backend.utils.password_policy import validate_password
from backend.utils.validate_image import validate_image
from backend.utils.send_email import send_contact_email
from backend.db.schemas import ContactForm
import shutil
import os

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=schemas.UserOut)
def get_me(
    current_user: models.User = Depends(get_current_user),
):
    return current_user


@router.get("/history", response_model=list[schemas.ImageBase])
def get_user_image_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
):
    return (
        db.query(models.Image)
        .filter(models.Image.user_id == current_user.id)
        .order_by(models.Image.upload_time.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    if user.id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized"
        )

    return user


@router.post("/contact")
async def contact(form: ContactForm):
    try:
        send_contact_email(from_email=form.email, message=form.message)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Email sending failed")


@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(
    user_id: int,
    user_in: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    if user.id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized"
        )

    if user_in.email is not None:
        user.email = user_in.email
    if user_in.name is not None:
        user.name = user_in.name
    if user_in.age is not None:
        user.age = user_in.age
    if user_in.gender is not None:
        user.gender = user_in.gender
    if user_in.password is not None:
        validate_password(user_in.password)
        user.hashed_password = hash_password(user_in.password)

    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    if user.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this user",
        )
    db.delete(user)
    db.commit()
    return status.HTTP_200_OK


@router.get("/{user_id}/history", response_model=list[schemas.ImageBase])
def get_user_image_history(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(10, ge=1, le=100, description="Max number of items to return"),
):
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized"
        )

    images = (
        db.query(models.Image)
        .filter(models.Image.user_id == user_id)
        .order_by(models.Image.upload_time.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return images
