from sqlalchemy.orm import Session
from src.backend.api.models import User
from passlib.hash import bcrypt

def get_user_by_name(db: Session, name: str):
    return db.query(User).filter(User.name == name).first()

def create_user(db: Session, name: str, password: str):
    hashed_password = bcrypt.hash(password)
    new_user = User(name=name, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user