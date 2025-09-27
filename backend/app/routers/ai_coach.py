from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import os
import json
from typing import List, Dict, Any
from datetime import datetime

from app.database.database import get_db
from app.models.models import User, Transaction, Budget, Goal
from app.models.schemas import AICoachRequest, AICoachResponse
from app.services.auth import get_current_active_user

# For a hackathon, we'll use a mock AI service
# In production, you would integrate with Azure OpenAI or another AI provider
def get_ai_response(message: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Mock AI coach response generator.
    In production, replace with actual call to Azure OpenAI API.
    """
    # Simple response patterns based on keywords
    response = "I'm your financial AI coach. "
    suggestions = []
    
    if "budget" in message.lower():
        response += "Managing your budget effectively is key to financial success. "
        response += "Based on your spending patterns, I recommend reviewing your monthly allocations."
        suggestions = [
            "Review your top spending categories",
            "Set up alerts for budget overruns",
            "Consider reducing spending on non-essentials"
        ]
    
    elif "savings" in message.lower() or "save" in message.lower():
        response += "Saving consistently is the foundation of financial security. "
        if user_data.get("total_expenses", 0) > user_data.get("total_income", 0) * 0.8:
            response += "I notice your expenses are quite high relative to your income. "
            response += "Try implementing the 50/30/20 rule - 50% for needs, 30% for wants, and 20% for savings."
        else:
            response += "You're doing well! Consider setting up automatic transfers to your savings account."
        
        suggestions = [
            "Start an emergency fund (3-6 months of expenses)",
            "Look into high-yield savings accounts",
            "Set specific savings goals"
        ]
    
    elif "goal" in message.lower():
        if user_data.get("goals"):
            response += f"I see you have {len(user_data['goals'])} financial goals set. "
            response += "Breaking down large goals into smaller milestones can make them more achievable."
        else:
            response += "Setting clear financial goals helps you stay motivated. "
            response += "Try setting SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound."
            
        suggestions = [
            "Review your progress weekly",
            "Celebrate small wins along the way",
            "Adjust your goals if circumstances change"
        ]
    
    else:
        response += "I can help you with budgeting, savings strategies, and financial goals. "
        response += "What specific financial aspect would you like guidance on?"
        suggestions = [
            "Create a budget plan",
            "Set up savings goals",
            "Analyze your spending patterns"
        ]
    
    return {
        "response": response,
        "suggestions": suggestions
    }

router = APIRouter(
    prefix="/ai-coach",
    tags=["AI Coach"],
    responses={404: {"description": "Not found"}},
)

@router.post("/chat", response_model=AICoachResponse)
async def chat_with_ai_coach(
    request: AICoachRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get user's financial data to contextualize AI responses
    today = datetime.utcnow()
    first_day_month = datetime(today.year, today.month, 1)
    
    # Get income and expenses
    total_income = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.is_income == True,
        Transaction.transaction_date >= first_day_month
    ).with_entities(
        Transaction.amount
    ).all()
    
    total_expenses = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.is_income == False,
        Transaction.transaction_date >= first_day_month
    ).with_entities(
        Transaction.category,
        Transaction.amount
    ).all()
    
    # Get goals
    goals = db.query(Goal).filter(
        Goal.user_id == current_user.id
    ).all()
    
    # Prepare user data context for AI
    user_data = {
        "total_income": sum(income.amount for income in total_income),
        "total_expenses": sum(expense.amount for _, expense in total_expenses),
        "expense_categories": {},
        "goals": [
            {
                "title": goal.title,
                "target": goal.target_amount,
                "current": goal.current_amount,
                "deadline": goal.deadline.isoformat() if goal.deadline else None
            }
            for goal in goals
        ]
    }
    
    # Aggregate expenses by category
    for category, amount in total_expenses:
        if category not in user_data["expense_categories"]:
            user_data["expense_categories"][category] = 0
        user_data["expense_categories"][category] += amount
    
    # Get AI response
    ai_response = get_ai_response(request.message, user_data)
    
    return AICoachResponse(
        response=ai_response["response"],
        suggestions=ai_response["suggestions"]
    )