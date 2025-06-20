from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db import Base

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    cancer_probability = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="results")