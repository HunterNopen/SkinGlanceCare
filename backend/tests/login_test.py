import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.db import models
from backend.auth.utils import hash_password
from datetime import datetime, timezone
from backend.db.database import get_db
from backend.main import app
from backend.tests.conftest import db_session


client = TestClient(app)


def override_get_db():
    try:
        yield db_session 
    finally:
        pass

app.dependency_overrides[get_db] = override_get_db


@pytest.fixture
def verified_user(db_session):
    user = models.User(
        email="login@test.com",
        name="Login User",
        password=hash_password("StrongPassword123!"),
        is_verified=True,
        rodo_accepted=True,
        rodo_accepted_at=datetime.now(timezone.utc), 
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    yield user

    db_session.delete(user)
    db_session.commit()



@pytest.fixture
def unverified_user(db_session):
    user = models.User(
        email="unverified@test.com",
        name="Unverified User",
        password=hash_password("StrongPassword123!"),
        is_verified=False,
        rodo_accepted=True,
        rodo_accepted_at=datetime.now(timezone.utc), 
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    yield user

    db_session.delete(user)
    db_session.commit()



def test_login_success(verified_user):
    response = client.post(
        "/access/login/",
        data={
            "username": verified_user.email,
            "password": "StrongPassword123!",
        },
    )

    assert response.status_code == 200
    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(verified_user):
    response = client.post(
        "/access/login/",
        data={
            "username": verified_user.email,
            "password": "WrongPassword",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_login_not_verified(unverified_user):
    response = client.post(
        "/access/login/",
        data={
            "username": unverified_user.email,
            "password": "StrongPassword123!",
        },
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Email not verified"
