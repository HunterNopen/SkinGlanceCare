from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    password: str

class UserInDB(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True