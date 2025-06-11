from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    password: str
