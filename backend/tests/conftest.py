from datetime import datetime
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from fastapi.testclient import TestClient
from backend.auth.auth import create_access_token
from backend.db.database import Base, get_db
from backend.main import app
from backend.db.database import get_db
from backend.db.models import User
from backend.auth.utils import hash_password

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(autouse=True)
def override_db_dependency(db_session):
    def _get_test_db():
        yield db_session

    app.dependency_overrides[get_db] = _get_test_db
    yield
    app.dependency_overrides.clear()

@pytest.fixture
def verified_user(db_session):
    user = User(
        email="test@example.com",
        password=hash_password("StrongPassword123!"),
        is_verified=True,
        name="Test User",
        rodo_accepted=True,
        rodo_accepted_at=datetime.utcnow()
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def auth_headers(verified_user):
    from backend.auth.utils import create_access_token
    
    token = create_access_token(data={"user_id": verified_user.id}) 
    
    return {"Authorization": f"Bearer {token}"}
