from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.models import Goal, User
from app.models.schemas import GoalCreate, GoalResponse, GoalUpdate
from app.services.auth import get_current_active_user

router = APIRouter(
    prefix="/goals",
    tags=["Goals"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=GoalResponse)
def create_goal(
    goal: GoalCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    db_goal = Goal(
        user_id=current_user.id,
        title=goal.title,
        description=goal.description,
        target_amount=goal.target_amount,
        deadline=goal.deadline
    )
    
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    
    return db_goal

@router.get("/", response_model=List[GoalResponse])
def read_goals(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).offset(skip).limit(limit).all()
    return goals

@router.get("/{goal_id}", response_model=GoalResponse)
def read_goal(
    goal_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if goal is None:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal

@router.patch("/{goal_id}", response_model=GoalResponse)
def update_goal(
    goal_id: int, 
    goal: GoalUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    db_goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if db_goal is None:
        raise HTTPException(status_code=404, detail="Goal not found")
        
    # Update goal fields
    update_data = goal.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_goal, key, value)
    
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(
    goal_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    db_goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if db_goal is None:
        raise HTTPException(status_code=404, detail="Goal not found")
        
    db.delete(db_goal)
    db.commit()
    return None