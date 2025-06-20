from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Annotated
from app.models import user
from app.api import analysis, auth
from app.db import SessionLocal, engine, Base
from app.schemas.user import UserCreate
from app.crud.user import get_user_by_name, create_user
from app.api.auth import get_current_user



app = FastAPI()
app.include_router(analysis.router)
app.include_router(auth.router)
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