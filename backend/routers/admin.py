from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.auth.utils import hash_password
from backend.db.database import get_db
from backend.db import schemas
from backend.auth.auth import get_current_admin, get_current_user

from backend.db import models

import shutil
import os

from backend.utils.generate_verification_code import generate_verification_code

router = APIRouter(prefix="/admin", tags=["AdminPage"])

@router.get("/users", response_model=list[schemas.UserOut])
def get_all_users( db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin),):
    return db.query(models.User).order_by(models.User.id).all()


@router.post("/users", response_model=schemas.UserOut, status_code=201)
def create_user( user_in: schemas.UserCreate, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin),
):
    existing_user = db.query(models.User).filter(
        models.User.email == user_in.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    user = models.User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        name=user_in.name,
        age=user_in.age,
        gender=user_in.gender,
        is_verified=user_in.is_verified,      
        is_admin=user_in.is_admin,
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.patch("/users/{user_id}", response_model=schemas.UserBase)
def update_user( user_id: int, user_in: schemas.AdminUserUpdate, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    update_data = user_in.model_dump(exclude_unset=True)

    if "password" in update_data:
        user.hashed_password = hash_password(update_data.pop("password"))

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin),
):
    user = db.query(models.User).get(user_id)
    if not user:
        raise HTTPException(status_code=404)

    db.delete(user)
    db.commit()
    return {"detail": "User deleted"}



@router.get("/images", response_model=list[schemas.ImageOut])
def get_all_images(
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin),
):
    return db.query(models.Image).all()

@router.delete("/images/{image_id}")
def delete_image(
    image_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin),
):
    image = db.query(models.Image).get(image_id)
    if not image:
        raise HTTPException(status_code=404)

    db.delete(image)
    db.commit()
    return {"detail": "Image deleted"}
