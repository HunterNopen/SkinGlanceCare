from .database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
import datetime
import enum
from sqlalchemy.types import Enum
from sqlalchemy import Boolean

class GenderEnum(str, enum.Enum):
    male = "male"
    female = "female"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String, unique=True, index=True, nullable=False)      
    password = Column(String, nullable=False)                             
    name = Column(String, nullable=False)                           

    age = Column(Integer, nullable=True)
    gender = Column(Enum(GenderEnum), nullable=True)

    is_verified = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    verification_code = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.now, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now, nullable=False)

    images = relationship("Image", back_populates="user", cascade="all, delete-orphan")


class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    upload_time = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    status = Column(String, default="uploaded")
    result = Column(Text, nullable=True)

    user = relationship("User", back_populates="images")
