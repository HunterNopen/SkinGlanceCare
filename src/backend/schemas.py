from pydantic import BaseModel, EmailStr, constr
from typing import Optional
import datetime

class UserBase(BaseModel):
    email: EmailStr
    phone_number: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserCreate(UserBase):
    email: EmailStr
    password: constr(min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[constr(min_length=6)] = None
    phone_number: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None

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