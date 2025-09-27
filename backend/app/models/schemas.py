from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Goal Schemas
class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    target_amount: float
    deadline: datetime

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    deadline: Optional[datetime] = None

class GoalResponse(GoalBase):
    id: int
    user_id: int
    current_amount: float
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Budget Schemas
class BudgetBase(BaseModel):
    category: str
    allocated_amount: float
    period_start: datetime
    period_end: datetime

class BudgetCreate(BudgetBase):
    pass

class BudgetUpdate(BaseModel):
    category: Optional[str] = None
    allocated_amount: Optional[float] = None
    spent_amount: Optional[float] = None
    period_start: Optional[datetime] = None
    period_end: Optional[datetime] = None

class BudgetResponse(BudgetBase):
    id: int
    user_id: int
    spent_amount: float
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Transaction Schemas
class TransactionBase(BaseModel):
    amount: float
    description: str
    category: str
    transaction_date: datetime
    is_income: bool = False

class TransactionCreate(TransactionBase):
    budget_id: Optional[int] = None

class TransactionResponse(TransactionBase):
    id: int
    user_id: int
    budget_id: Optional[int]
    created_at: datetime

    class Config:
        orm_mode = True

# AI Coach Schemas
class AICoachRequest(BaseModel):
    message: str

class AICoachResponse(BaseModel):
    response: str
    suggestions: Optional[List[str]] = None