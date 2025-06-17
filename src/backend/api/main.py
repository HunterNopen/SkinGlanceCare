import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')))

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Annotated
from src.backend.api import analysis, auth, models
from src.backend.api.db import SessionLocal, engine, Base
from src.backend.api.schemas import UserCreate
from src.backend.api.crud import get_user_by_name, create_user
from src.backend.api.auth import get_current_user

app = FastAPI()
app.include_router(analysis.router)

Base.metadata.create_all(bind=engine)


origins = [
    "http://localhost:5173",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

# # Testowy endpoint chroniony tokenem
@app.get("/")
async def user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return {"User": user}

# # (opcjonalnie) GET user by ID (dla testów)
# @app.get("/users/{user_id}")
# def get_user(user_id: int, db: Session = Depends(get_db)):
#     user = db.query(models.User).get(user_id)
#     if not user:
#         raise HTTPException(status_code=404, detail="Użytkownik nie istnieje.")
#     return user
