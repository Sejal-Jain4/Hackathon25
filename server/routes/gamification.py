from flask import Blueprint, request, jsonify
import time

gamification_bp = Blueprint('gamification', __name__)

# Get user's gamification stats
@gamification_bp.route('/stats/<user_id>', methods=['GET'])
def get_gamification_stats(user_id):
    # Placeholder for gamification stats
    return jsonify({
        "userId": user_id,
        "level": 5,
        "xp": 1250,
        "xpToNextLevel": 500,
        "streak": 7,
        "badges": [
            {"id": "budget_boss_1", "name": "Budget Boss Level 1", 
             "description": "Created your first budget", "earned": True, "date": "2025-09-01"},
            {"id": "saver_1", "name": "Saver Level 1", 
             "description": "Saved your first $100", "earned": True, "date": "2025-09-10"},
            {"id": "streak_7", "name": "Week Warrior", 
             "description": "Maintained a 7-day streak", "earned": True, "date": "2025-09-20"}
        ],
        "achievements": [
            {"id": "first_budget", "name": "First Budget", "completed": True, "date": "2025-09-01"},
            {"id": "track_week", "name": "Expense Tracking Week", "completed": True, "date": "2025-09-07"},
            {"id": "save_100", "name": "Save $100", "completed": True, "date": "2025-09-10"},
            {"id": "save_500", "name": "Save $500", "completed": False, "progress": 50}
        ]
    })

# Award XP to a user
@gamification_bp.route('/award-xp', methods=['POST'])
def award_xp():
    data = request.json
    user_id = data.get('userId')
    amount = data.get('amount', 0)
    reason = data.get('reason', '')
    
    # Placeholder for XP awarding logic
    return jsonify({
        "userId": user_id,
        "xpAwarded": amount,
        "reason": reason,
        "newTotal": 1250 + amount,
        "levelUp": amount > 100,  # Simple check if this would trigger a level up
        "newLevel": 6 if amount > 100 else 5
    })

# Unlock a badge
@gamification_bp.route('/unlock-badge', methods=['POST'])
def unlock_badge():
    data = request.json
    user_id = data.get('userId')
    badge_id = data.get('badgeId')
    
    # Placeholder for badge unlocking logic
    return jsonify({
        "userId": user_id,
        "badgeId": badge_id,
        "badgeName": "New Badge",
        "unlocked": True,
        "date": time.strftime("%Y-%m-%d")
    })