from pydantic import BaseModel
from typing import List, Optional

class SimulateRequest(BaseModel):
    amount: float
    description: Optional[str] = None

class SimulateResponse(BaseModel):
    afford: bool
    newBalance: float
    message: str

class Goal(BaseModel):
    id: int
    name: str
    target: float
    current: float

class AIRequest(BaseModel):
    text: str

class AIResponse(BaseModel):
    reply: str

class BalanceResponse(BaseModel):
    balance: float

class CreateGoalRequest(BaseModel):
    name: str
    target: float
    current: float = 0.0
