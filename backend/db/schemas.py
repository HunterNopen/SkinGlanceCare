from typing import List
from pydantic import BaseModel, EmailStr, constr
from typing import Optional, List
import datetime
from backend.db.models import GenderEnum
from pydantic import Field


class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: constr(min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[constr(min_length=6)] = None
    name: Optional[str] = None


class UserOut(UserBase):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


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
    code: str


class ResendEmail(BaseModel):
    email: str


class ForgotPassword(BaseModel):
    email: str


class ResetPassword(BaseModel):
    token: str
    new_password: constr(min_length=6)


class MailBody(BaseModel):
    to: List[str]
    subject: str
    body: str


class ImageOut(ImageBase):
    user_id: int
    result: Optional[str] = None


class ContactForm(BaseModel):
    email: EmailStr
    message: str = Field(..., min_length=10, max_length=2000)
