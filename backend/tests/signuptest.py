import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.main import app  
from backend.db.database import Base, get_db
from backend.db import models

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture
def new_user_data():
    return {
        "email": "test@example.com",
        "password": "StrongPassword123!",
        "name": "Test User",
        "rodo_accepted": True
    }

@patch("backend.routers.access.send_verification_email")
def test_create_user(mock_send_email, client, new_user_data):
    mock_send_email.return_value = None

    response = client.post("/access/signup/", json=new_user_data)

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == new_user_data["email"]

