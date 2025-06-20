from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.config import SECRET_KEY, ALGORITHM

from app.models.user import User
from app.crud.user import get_user_by_name
from app.db import get_db


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def authenticate_user(username: str, password: str, db: Session):
    user = get_user_by_name(db, username)
    if not user or not pwd_context.verify(password, user.password):
        return None
    return user

def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    to_encode = {
        "sub": username,
        "user_id": user_id,
        "exp": datetime.utcnow() + expires_delta,
    }
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise _credentials_exception()
    except JWTError:
        raise _credentials_exception()

    user = get_user_by_name(db, username)
    if not user:
        raise _credentials_exception()
    return user

def _credentials_exception():
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
