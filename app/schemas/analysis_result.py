from pydantic import BaseModel
from datetime import datetime

class AnalysisResultCreate(BaseModel):
    filename: str
    cancer_probability: float

class AnalysisResultOut(AnalysisResultCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True