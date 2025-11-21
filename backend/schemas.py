from pydantic import BaseModel, EmailStr, constr
from typing import Optional
import datetime

# -------------------------------
# Podstawowy schemat użytkownika
class UserBase(BaseModel):
    email: EmailStr
    first_name: str                  # wymagane
    last_name: Optional[str] = None
    phone_number: Optional[str] = None

# -------------------------------
# Schemat do tworzenia użytkownika
class UserCreate(UserBase):
    password: constr(min_length=6)  # wymagane

# -------------------------------
# Schemat logowania
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# -------------------------------
# Schemat aktualizacji użytkownika
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[constr(min_length=6)] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None

# -------------------------------
# Schemat wyjściowy
class UserOut(UserBase):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        orm_mode = True

# -------------------------------
# Token
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# -------------------------------
# Schemat obrazu
class ImageBase(BaseModel):
    id: int
    filename: str
    upload_time: datetime.datetime
    status: str
    result: Optional[str] = None

    class Config:
        orm_mode = True
