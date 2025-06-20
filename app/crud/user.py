from sqlalchemy.orm import Session
from ..models.user import User
from passlib.hash import bcrypt
from app.models.analysis_result import AnalysisResult

def get_user_by_name(db: Session, name: str):
    return db.query(User).filter(User.name == name).first()

def create_user(db: Session, name: str, password: str):
    hashed_password = bcrypt.hash(password)
    new_user = User(name=name, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def create_analysis_result(db, user_id: int, filename: str, cancer_probability: float):
    result = AnalysisResult(
        filename=filename,
        cancer_probability=cancer_probability,
        user_id=user_id,
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return result