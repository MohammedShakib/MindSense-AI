from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    name: Optional[str] = None
    password: str

class UserResponse(UserBase):
    id: UUID
    name: Optional[str] = None
    is_active: bool
    is_superuser: bool
    created_at: datetime
    google_id: Optional[str] = None
    profile_picture: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
