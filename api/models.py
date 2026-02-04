from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class User(BaseModel):
    id: Optional[UUID] = None
    email: str
    name: Optional[str] = None
    role: Optional[str] = "member"
    company_id: Optional[UUID] = None
    created_at: Optional[datetime] = None

class UserInDB(User):
    password_hash: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class DesignProject(BaseModel):
    id: Optional[UUID] = None
    user_id: Optional[UUID] = None
    type: str
    title: str
    content: dict  # JSON content
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class CreateProjectRequest(BaseModel):
    type: str
    title: str
    content: dict

class UpdateProjectRequest(BaseModel):
    title: Optional[str] = None
    content: Optional[dict] = None
