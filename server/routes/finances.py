from flask import Blueprint, request, jsonify
from datetime import datetime

finances_bp = Blueprint('finances', __name__)

# Get financial summary for a user
@finances_bp.route('/summary/<user_id>', methods=['GET'])
def get_financial_summary(user_id):
    # Placeholder for financial summary
    return jsonify({
        "userId": user_id,
        "balance": 842.50,
        "income": [
            {"source": "Part-time job", "amount": 450.00, "date": "2025-09-15"},
            {"source": "Tutoring", "amount": 120.00, "date": "2025-09-20"},
            {"source": "Allowance", "amount": 200.00, "date": "2025-09-01"}
        ],
        "expenses": [
            {"category": "Food", "amount": 150.00, "date": "2025-09-10"},
            {"category": "Entertainment", "amount": 45.00, "date": "2025-09-18"},
            {"category": "Books", "amount": 85.50, "date": "2025-09-05"}
        ],
        "savings": 250.00,
        "recurring": [
            {"name": "Spotify", "amount": 9.99, "frequency": "monthly"},
            {"name": "Netflix", "amount": 13.99, "frequency": "monthly"}
        ]
    })

# Simulate a purchase
@finances_bp.route('/simulate-purchase', methods=['POST'])
def simulate_purchase():
    data = request.json
    user_id = data.get('userId')
    amount = data.get('amount', 0)
    category = data.get('category', 'Other')
    
    # Placeholder for purchase simulation logic
    current_balance = 842.50
    affordable = current_balance >= amount
    
    return jsonify({
        "affordable": affordable,
        "currentBalance": current_balance,
        "remainingBalance": current_balance - amount if affordable else current_balance,
        "recommendation": "This purchase is within your budget." if affordable else 
            "This purchase would exceed your current balance. Consider waiting until after your next income."
    })

# Get transaction history
@finances_bp.route('/transactions/<user_id>', methods=['GET'])
def get_transactions(user_id):
    # Placeholder for transaction history
    return jsonify({
        "userId": user_id,
        "transactions": [
            {"type": "income", "category": "Part-time job", "amount": 450.00, "date": "2025-09-15"},
            {"type": "expense", "category": "Food", "amount": 150.00, "date": "2025-09-10"},
            {"type": "expense", "category": "Entertainment", "amount": 45.00, "date": "2025-09-18"},
            {"type": "income", "category": "Tutoring", "amount": 120.00, "date": "2025-09-20"},
            {"type": "expense", "category": "Books", "amount": 85.50, "date": "2025-09-05"},
            {"type": "income", "category": "Allowance", "amount": 200.00, "date": "2025-09-01"}
        ]
    })