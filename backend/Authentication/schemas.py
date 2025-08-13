from pydantic import BaseModel
import datetime

class UserCreate(BaseModel):
    username: str
    email: str
    contact:int
    password1:str
    password2:str



class requestdetails(BaseModel):
    username:str
    password:str

class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_at: datetime.datetime

class changepassword(BaseModel):
    email:str
    old_password:str
    new_password:str

class TokenCreate(BaseModel):
    user_id: int
    access_token: str
    refresh_token: str
    status:bool
    expires_at: datetime.datetime
    created_at: datetime.datetime = datetime.datetime.utcnow()
    