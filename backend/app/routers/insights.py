from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from typing import List, Dict

from app.database.database import get_db
from app.models.models import User, Transaction, Budget, Goal
from app.services.auth import get_current_active_user

router = APIRouter(
    prefix="/insights",
    tags=["Insights"],
    responses={404: {"description": "Not found"}},
)

@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    # Get current month's dates
    today = datetime.utcnow()
    first_day_month = datetime(today.year, today.month, 1)
    
    # Calculate total income for current month
    total_income = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.is_income == True,
        Transaction.transaction_date >= first_day_month,
        Transaction.transaction_date <= today
    ).scalar() or 0
    
    # Calculate total expenses for current month
    total_expenses = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.is_income == False,
        Transaction.transaction_date >= first_day_month,
        Transaction.transaction_date <= today
    ).scalar() or 0
    
    # Get active budgets
    active_budgets = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.period_end >= today
    ).count()
    
    # Get active goals
    active_goals = db.query(Goal).filter(
        Goal.user_id == current_user.id,
        Goal.deadline >= today,
        Goal.current_amount < Goal.target_amount
    ).count()
    
    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "net_savings": total_income - total_expenses,
        "active_budgets": active_budgets,
        "active_goals": active_goals
    }

@router.get("/spending-by-category")
def get_spending_by_category(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user),
    days: int = 30
):
    # Calculate date range
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    
    # Query spending by category
    spending_by_category = db.query(
        Transaction.category,
        func.sum(Transaction.amount).label("amount")
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.is_income == False,
        Transaction.transaction_date >= start_date,
        Transaction.transaction_date <= end_date
    ).group_by(
        Transaction.category
    ).order_by(
        desc("amount")
    ).all()
    
    return [
        {"category": category, "amount": float(amount)}
        for category, amount in spending_by_category
    ]

@router.get("/budget-status")
def get_budget_status(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    # Get current active budgets
    today = datetime.utcnow()
    active_budgets = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.period_end >= today
    ).all()
    
    budget_status = []
    for budget in active_budgets:
        # Calculate percentage used
        if budget.allocated_amount > 0:
            percentage_used = (budget.spent_amount / budget.allocated_amount) * 100
        else:
            percentage_used = 0
        
        budget_status.append({
            "id": budget.id,
            "category": budget.category,
            "allocated_amount": budget.allocated_amount,
            "spent_amount": budget.spent_amount,
            "remaining_amount": budget.allocated_amount - budget.spent_amount,
            "percentage_used": percentage_used,
            "period_end": budget.period_end
        })
    
    return budget_status

@router.get("/goal-progress")
def get_goal_progress(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    # Get all user goals
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).all()
    
    goal_progress = []
    for goal in goals:
        # Calculate percentage complete and days remaining
        today = datetime.utcnow().date()
        days_remaining = (goal.deadline.date() - today).days if goal.deadline > datetime.utcnow() else 0
        
        if goal.target_amount > 0:
            percentage_complete = (goal.current_amount / goal.target_amount) * 100
        else:
            percentage_complete = 0
        
        goal_progress.append({
            "id": goal.id,
            "title": goal.title,
            "target_amount": goal.target_amount,
            "current_amount": goal.current_amount,
            "remaining_amount": goal.target_amount - goal.current_amount,
            "percentage_complete": percentage_complete,
            "deadline": goal.deadline,
            "days_remaining": days_remaining
        })
    
    return goal_progress

@router.get("/spending-trends")
def get_spending_trends(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user),
    months: int = 6
):
    # Calculate date range
    end_date = datetime.utcnow()
    start_date = datetime(end_date.year, end_date.month, 1) - timedelta(days=30 * (months - 1))
    
    # Initialize result with all months
    result = {}
    current_date = start_date
    while current_date <= end_date:
        month_key = current_date.strftime("%Y-%m")
        result[month_key] = {
            "month": current_date.strftime("%b %Y"),
            "income": 0,
            "expenses": 0
        }
        current_date = datetime(current_date.year + (current_date.month // 12), 
                              ((current_date.month % 12) + 1), 1)
    
    # Query income by month
    income_by_month = db.query(
        func.strftime("%Y-%m", Transaction.transaction_date).label("month"),
        func.sum(Transaction.amount).label("amount")
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.is_income == True,
        Transaction.transaction_date >= start_date,
        Transaction.transaction_date <= end_date
    ).group_by(
        "month"
    ).all()
    
    # Query expenses by month
    expenses_by_month = db.query(
        func.strftime("%Y-%m", Transaction.transaction_date).label("month"),
        func.sum(Transaction.amount).label("amount")
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.is_income == False,
        Transaction.transaction_date >= start_date,
        Transaction.transaction_date <= end_date
    ).group_by(
        "month"
    ).all()
    
    # Update result with actual data
    for month, amount in income_by_month:
        if month in result:
            result[month]["income"] = float(amount)
    
    for month, amount in expenses_by_month:
        if month in result:
            result[month]["expenses"] = float(amount)
    
    # Convert to list and sort by month
    trends = list(result.values())
    
    return trends