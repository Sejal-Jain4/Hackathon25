from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.models import Budget, User
from app.models.schemas import BudgetCreate, BudgetResponse, BudgetUpdate
from app.services.auth import get_current_active_user

router = APIRouter(
    prefix="/budgets",
    tags=["Budgets"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=BudgetResponse)
def create_budget(
    budget: BudgetCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    db_budget = Budget(
        user_id=current_user.id,
        category=budget.category,
        allocated_amount=budget.allocated_amount,
        period_start=budget.period_start,
        period_end=budget.period_end
    )
    
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    
    return db_budget

@router.get("/", response_model=List[BudgetResponse])
def read_budgets(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    budgets = db.query(Budget).filter(Budget.user_id == current_user.id).offset(skip).limit(limit).all()
    return budgets

@router.get("/{budget_id}", response_model=BudgetResponse)
def read_budget(
    budget_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == current_user.id).first()
    if budget is None:
        raise HTTPException(status_code=404, detail="Budget not found")
    return budget

@router.patch("/{budget_id}", response_model=BudgetResponse)
def update_budget(
    budget_id: int, 
    budget: BudgetUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    db_budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == current_user.id).first()
    if db_budget is None:
        raise HTTPException(status_code=404, detail="Budget not found")
        
    # Update budget fields
    update_data = budget.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_budget, key, value)
    
    db.commit()
    db.refresh(db_budget)
    return db_budget

@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(
    budget_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    db_budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == current_user.id).first()
    if db_budget is None:
        raise HTTPException(status_code=404, detail="Budget not found")
        
    db.delete(db_budget)
    db.commit()
    return None