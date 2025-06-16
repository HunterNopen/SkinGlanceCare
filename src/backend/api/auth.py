from datetime import datetime, timedelta
import re
from sqlite3 import IntegrityError
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, validator
from starlette import status
from crud import get_user_by_name
from db import SessionLocal
from sqlalchemy.orm import Session
from db import get_db
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from models import User
from jose import jwt
from jose.exceptions import JWTError
from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"


bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")

def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
        user = get_user_by_name(db, username)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
        return user
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

class CreateUserRequest(BaseModel):
    username: str
    password: str

    @validator("password")
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", value):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", value):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise ValueError("Password must contain at least one special character")
        return value

class Token(BaseModel):
    access_token: str
    token_type: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[SessionLocal, Depends(get_db)]

# rejestracja
@router.post("/signup", status_code=status.HTTP_201_CREATED)
def create_user(
    request: CreateUserRequest,           
    db: Session = Depends(get_db),        
):
    existing_user = get_user_by_name(db, request.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )

    hashed_password = bcrypt_context.hash(request.password)
    new_user = User(name=request.username, password=hashed_password)
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not create user (possible duplicate)"
        )

    return {"message": "User created successfully"}


@router.post("/token",response_model=Token)
async def login_for_access_token(
    form_data:Annotated[OAuth2PasswordRequestForm, Depends()],
    db: db_dependency): # type: ignore
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid authentication credentials")
    token = create_access_token(
        user.name,
        user.id,
        expires_delta=timedelta(minutes=15)
    )
    return Token(
        access_token=token,
        token_type="bearer"
    )
 
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

def create_access_token(username: str, user_id: int, expires_delta: timedelta = None):
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    payload = {"sub": username, "id": user_id, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def authenticate_user(username: str, password: str, db: Session):
    user = get_user_by_name(db, username)
    if not user:
        return None
    if not bcrypt_context.verify(password, user.password):
        return None
    return user

@router.post("/login", response_model=TokenResponse)
def login_json(request: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(request.username, request.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    token = create_access_token(user.name, user.id, expires_delta=timedelta(minutes=60))
    return {"access_token": token}
    
@router.get("/check-auth")
def check_auth(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Ten endpoint zwraca dane aktualnie zalogowanego użytkownika.
    Jeśli token jest nieprawidłowy, get_current_user rzuci HTTPException(401).
    """

    user_in_db = db.query(User).filter(User.name == current_user["username"]).first()
    if not user_in_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

    return {
        "id": user_in_db.id,
        "username": user_in_db.name,

    }