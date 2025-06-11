
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session

DATABASE_URL = "postgresql://postgres:qwerty@localhost:5432/PythonProject"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

def get_db() -> Session:
    """
    Zależność FastAPI do pobierania sesji SQLAlchemy.
    Używamy jej jako Depends(get_db) w endpointach.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
