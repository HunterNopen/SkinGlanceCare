from typing import List
from pydantic import BaseModel, EmailStr, constr
from typing import Optional, List
import datetime
from backend.db.models import GenderEnum
from pydantic import Field


# -------------------------------
# Podstawowy schemat użytkownika
class UserBase(BaseModel):
    email: EmailStr
    name: str

    age: Optional[int] = Field(
        default=None,
        ge=0,
        le=120,
    )
    gender: Optional[GenderEnum] = None


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
    name: Optional[str] = None

    age: Optional[int] = Field(
        default=None,
        ge=0,
        le=120,
    )
    gender: Optional[GenderEnum] = None


class AdminUserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[constr(min_length=6)] = None
    name: Optional[str] = None

    age: Optional[int] = Field(
        default=None,
        ge=0,
        le=120,
    )
    gender: Optional[GenderEnum] = None
    is_verified: Optional[bool] = None
    is_admin: Optional[bool] = None
    verification_code: Optional[str] = None

    class Config:
        extra = "forbid"


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


class ImagePredictionConfidence(BaseModel):
    label: str
    confidence: float


class ImageAnalysisResponse(BaseModel):
    image_id: int
    predicted_class: str
    predicted_class_full: str
    predicted_probability: float
    confidence_score: float
    confidence_top3_score: float
    confidences: List[ImagePredictionConfidence]


class LLMMessageResponse(BaseModel):
    image_id: int
    llm_message: str

    class Config:
        orm_mode = True


class ImageOut(ImageBase):
    user_id: int


class VerifyEmail(BaseModel):
    # email: EmailStr
    code: str


class ResendEmail(BaseModel):
    email: str


class MailBody(BaseModel):
    to: List[str]
    subject: str
    body: str
