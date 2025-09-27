from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.models import Transaction, Budget, User
from app.models.schemas import TransactionCreate, TransactionResponse
from app.services.auth import get_current_active_user

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=TransactionResponse)
def create_transaction(
    transaction: TransactionCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    # If budget_id is provided, verify it belongs to the user
    if transaction.budget_id:
        budget = db.query(Budget).filter(
            Budget.id == transaction.budget_id, 
            Budget.user_id == current_user.id
        ).first()
        
        if not budget:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid budget ID or budget does not belong to user"
            )
        
        # Update budget spent amount if it's an expense
        if not transaction.is_income:
            budget.spent_amount += transaction.amount
            db.add(budget)
    
    # Create transaction
    db_transaction = Transaction(
        user_id=current_user.id,
        budget_id=transaction.budget_id,
        amount=transaction.amount,
        description=transaction.description,
        category=transaction.category,
        transaction_date=transaction.transaction_date,
        is_income=transaction.is_income
    )
    
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    
    return db_transaction

@router.get("/", response_model=List[TransactionResponse])
def read_transactions(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    ).order_by(
        Transaction.transaction_date.desc()
    ).offset(skip).limit(limit).all()
    
    return transactions

@router.get("/{transaction_id}", response_model=TransactionResponse)
def read_transaction(
    transaction_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id, 
        Transaction.user_id == current_user.id
    ).first()
    
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    return transaction

@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    transaction_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id, 
        Transaction.user_id == current_user.id
    ).first()
    
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Update budget spent amount if the transaction is linked to a budget and is an expense
    if transaction.budget_id and not transaction.is_income:
        budget = db.query(Budget).filter(Budget.id == transaction.budget_id).first()
        if budget:
            budget.spent_amount -= transaction.amount
            db.add(budget)
    
    db.delete(transaction)
    db.commit()
    return None