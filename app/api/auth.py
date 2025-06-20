from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.api import analysis
from app.models.user import User
from app.schemas.analysis_result import AnalysisResultCreate, AnalysisResultOut
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate
from app.schemas.token import Token
from app.services.auth_service import authenticate_user, create_access_token
from app.core.security import get_current_user
from app.db import get_db
from app.crud.user import get_user_by_name, create_user
from app.crud.user import create_analysis_result

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if get_user_by_name(db, user.name):
        raise HTTPException(400, "User already exists")
    create_user(db, user.name, user.password)
    return {"message": "User created"}

@router.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(401, "Invalid credentials")
    token = create_access_token(user.name, user.id, timedelta(minutes=60))
    return {"access_token": token, "token_type": "bearer"}


@router.get("/check-auth")
def check_auth(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.name,
    }

@router.post("/login", response_model=TokenResponse)
def login_json(request: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(request.username, request.password, db)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )
    
    token = create_access_token(user.name, user.id, expires_delta=timedelta(minutes=60))
    return {"access_token": token, "token_type": "bearer"}

@router.post("/analysis/save", response_model=AnalysisResultOut)
def save_result(payload: AnalysisResultCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return create_analysis_result(
        db, user_id=user.id, filename=payload.filename, cancer_probability=payload.cancer_probability
    )