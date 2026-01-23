from datetime import timedelta
from datetime import datetime
import random
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from backend.auth import auth
from backend.db.database import engine, get_db
from backend.db import models
import backend.db.models as models
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import re
from backend.db import schemas
from backend.db.database import engine, get_db
from backend.auth.utils import hash_password, verify_password
from backend.auth.auth import (
    create_access_token,
    get_current_user,
    verify_access_token,
    verify_reset_password_token,
)
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from backend.routers import access, image, user
from fastapi.middleware.cors import CORSMiddleware

from backend.utils.generate_verification_code import generate_verification_code
from backend.auth.auth import create_reset_password_token, verify_access_token
from backend.utils.password_policy import validate_password
from backend.utils.send_email import send_reset_password_email, send_verification_email

from backend.db import models

from backend.utils.rate_limiter import limiter
from fastapi import Request

from backend.utils.generate_verification_code import generate_verification_code
from backend.utils.send_email import send_verification_email

router = APIRouter(prefix="/access", tags=["Access"])


@router.post("/signup/", response_model=schemas.UserOut, status_code=201)
@limiter.limit("5/minute")
def create_user(
    request: Request,
    user_in: schemas.UserCreate,
    db: Session = Depends(get_db),
):
    if not user_in.rodo_accepted:
        raise HTTPException(
            status_code=400,
            detail="RODO consent is required",
        )

    existing_user = (
        db.query(models.User)
        .filter(models.User.email == user_in.email)
        .first()
    )
    if existing_user:
        raise HTTPException(400, "Email already registered")

    validate_password(user_in.password)

    verification_code = generate_verification_code()

    user = models.User(
        email=user_in.email,
        password=hash_password(user_in.password),
        name=user_in.name,
        verification_code=verification_code,
        is_verified=False,

        rodo_accepted=True,
        rodo_accepted_at=datetime.utcnow()
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    send_verification_email(user.email, verification_code)

    return user



@router.post("/login/", response_model=schemas.Token)
@limiter.limit("5/minute")
def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    print("LOGIN REQUEST RECEIVED")
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified")

    access_token_expires = timedelta(minutes=60)
    access_token = create_access_token(
        data={"user_id": user.id}, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "name": user.name},
    }


@router.post("/verify_email/")
def verify_email(data: schemas.VerifyEmail, db: Session = Depends(get_db)):
    user = (
        db.query(models.User).filter(models.User.verification_code == data.code).first()
    )

    if not user:
        raise HTTPException(404, "Invalid verification code")

    if user.is_verified:
        raise HTTPException(400, "Email already verified")

    if user.verification_code != data.code:
        raise HTTPException(400, "Invalid verification code")

    user.is_verified = True
    user.verification_code = None

    db.commit()

    return {"message": "Email successfully verified"}


@router.post("/resend_verification_email/")
@limiter.limit("3/minute")
def resend_verification_email(
    request: Request, data: schemas.ResendEmail, db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        raise HTTPException(404, "User not found")
    if user.is_verified:
        raise HTTPException(400, "User already verified")

    verification_code = generate_verification_code()
    user.verification_code = verification_code
    db.commit()

    send_verification_email(user.email, verification_code)

    return {"message": "Verification email resent"}


@router.post("/forgot-password")
def forgot_password(data: schemas.ForgotPassword, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        return {"message": "If email exists, instructions sent"}

    token = create_reset_password_token(data.email)
    send_reset_password_email(data.email, token)

    return {"message": "Reset instructions sent"}


@router.post("/reset-password")
def reset_password(data: schemas.ResetPassword, db: Session = Depends(get_db)):
    email = verify_reset_password_token(data.token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token",
        )

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token",
        )

    if verify_password(data.new_password, user.password):
        raise HTTPException(400, "New password must be different")

    validate_password(data.new_password)

    user.password = hash_password(data.new_password)
    db.commit()

    return {"message": "Password updated successfully"}
