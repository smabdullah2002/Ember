from pydantic import BaseModel, EmailStr
from enum import Enum

class SignupSchema(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str

class LoginSchema(BaseModel):
    email: EmailStr
    password: str