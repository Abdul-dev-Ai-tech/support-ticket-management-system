from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class TicketCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: str = Field(..., min_length=10)
    category: Literal["technical", "billing", "account", "general"]
    priority: Literal["low", "medium", "high"]


class TicketUpdate(BaseModel):
    title: str | None = Field(None, min_length=3, max_length=100)
    description: str | None = Field(None, min_length=10)
    category: Literal["technical", "billing", "account", "general"] | None = None
    priority: Literal["low", "medium", "high"] | None = None
    status: Literal["open", "in_progress", "resolved", "closed"] | None = None


class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TicketRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    category: str
    priority: str
    status: str
    created_by: int
    created_at: datetime
    updated_at: datetime


class TicketListResponse(BaseModel):
    items: list[TicketRead]
    page: int
    limit: int
    total: int
    total_pages: int


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    role: str
