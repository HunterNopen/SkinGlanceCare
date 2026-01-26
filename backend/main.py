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
from backend.routers import access, image, user
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager
from sqlalchemy.exc import OperationalError
import logging
from backend.utils.rate_limiter import limiter
from slowapi.middleware import SlowAPIMiddleware
from backend.utils.generate_verification_code import generate_verification_code
from backend.utils.send_email import send_verification_email


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        models.Base.metadata.create_all(bind=engine)
        logging.info("Database connection successful.")
    except OperationalError as e:
        logging.error(f"Database connection failed during startup: {e}")
        logging.warning("Server is running, but DB-dependent features will fail.")
    except Exception as e:
        logging.critical(f"Unexpected error during database initialization: {e}")

    yield
    logging.info("Shutting down application...")


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "https://skinglancecare-front.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SlowAPIMiddleware)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


app.include_router(image.router)
app.include_router(user.router)
app.include_router(access.router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/health", tags=["system"])
async def health_check():
    return {"status": "ok"}
