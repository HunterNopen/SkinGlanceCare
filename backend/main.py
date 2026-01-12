from fastapi import FastAPI, Depends, status, HTTPException, Response
from backend.auth import auth
from backend.db.database import engine, get_db
from backend.db import models
import backend.db.models as models
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi.staticfiles import StaticFiles
from backend.db import schemas
from backend.db.database import engine, get_db
from backend.auth.utils import hash_password, verify_password
from backend.auth.auth import create_access_token, verify_access_token
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from backend.routers import access, admin, image, user
from fastapi.middleware.cors import CORSMiddleware

from backend.utils.generate_verification_code import generate_verification_code
from backend.utils.send_email import send_verification_email


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

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


app.include_router(image.router)
app.include_router(user.router)
app.include_router(admin.router)
app.include_router(access.router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
async def root():
    return {"message": "Hello, World!"}
