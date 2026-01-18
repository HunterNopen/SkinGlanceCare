from .database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String, unique=True, index=True, nullable=False)      # wymagane
    password = Column(String, nullable=False)                             # wymagane
    first_name = Column(String, nullable=False)                           # wymagane

    phone_number = Column(String, nullable=True)                          # opcjonalne
    last_name = Column(String, nullable=True)                              # opcjonalne

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
