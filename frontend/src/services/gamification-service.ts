// This service manages the gamification aspects of the app:
// - XP points
// - Levels
// - Badges
// - Streaks

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isUnlocked: boolean;
}

export interface Achievement {
  badgeId: string;
  unlockedAt: Date;
  xpAwarded: number;
}

export interface LevelInfo {
  level: number;
  currentXp: number;
  xpForNextLevel: number;
  percentToNextLevel: number;
}

// Sample badges for the hackathon
export const BADGES: Badge[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Created your first financial goal',
    icon: 'shoe-print',
    color: '#5B37B7',
    isUnlocked: true,
  },
  {
    id: 'streak-3',
    name: '3-Day Streak',
    description: 'Checked your finances for 3 days in a row',
    icon: 'fire',
    color: '#FF8C00',
    isUnlocked: true,
  },
  {
    id: 'budget-boss',
    name: 'Budget Boss',
    description: 'Stayed under budget for one month',
    icon: 'cash',
    color: '#2E8B57',
    isUnlocked: true,
  },
  {
    id: 'goal-crusher',
    name: 'Goal Crusher',
    description: 'Reached your first savings goal',
    icon: 'flag-checkered',
    color: '#CD5C5C',
    isUnlocked: false,
  },
  {
    id: 'subscription-slayer',
    name: 'Subscription Slayer',
    description: 'Cancelled an unused subscription',
    icon: 'cancel',
    color: '#4682B4',
    isUnlocked: false,
  },
];

export const GamificationService = {
  // Calculate level based on XP
  calculateLevel(xp: number): LevelInfo {
    // Simple level formula: level = sqrt(xp / 100)
    const level = Math.floor(Math.sqrt(xp / 100)) + 1;
    
    // XP needed for next level
    const xpForCurrentLevel = (level - 1) * (level - 1) * 100;
    const xpForNextLevel = level * level * 100;
    
    // Calculate percentage to next level
    const xpInCurrentLevel = xp - xpForCurrentLevel;
    const xpRequiredForNextLevel = xpForNextLevel - xpForCurrentLevel;
    const percentToNextLevel = (xpInCurrentLevel / xpRequiredForNextLevel) * 100;
    
    return {
      level,
      currentXp: xp,
      xpForNextLevel,
      percentToNextLevel,
    };
  },

  // Award XP for an action
  awardXP(currentXp: number, action: string): number {
    // XP rewards for different actions
    const xpRewards: Record<string, number> = {
      'create_goal': 20,
      'login_streak': 10,
      'add_transaction': 5,
      'complete_goal': 50,
      'cancel_subscription': 30,
      'stay_under_budget': 25,
      'check_insights': 5,
    };

    const xpAwarded = xpRewards[action] || 1;
    return currentXp + xpAwarded;
  },

  // Get all badges for a user
  getBadges(): Badge[] {
    // In a real app, this would fetch from the backend
    return BADGES;
  },

  // Check if user has earned new badges
  checkForNewBadges(
    achievements: Achievement[],
    streak: number,
    goalsCompleted: number,
    subscriptionsCancelled: number
  ): Badge[] {
    // In a real app, this would have more complex logic
    // For the hackathon, we'll return some sample badges
    const newBadges: Badge[] = [];
    
    // Check for streak badges
    if (streak >= 3) {
      newBadges.push(BADGES.find(badge => badge.id === 'streak-3')!);
    }
    
    // Check for goal completion badges
    if (goalsCompleted > 0) {
      newBadges.push(BADGES.find(badge => badge.id === 'goal-crusher')!);
    }
    
    // Check for subscription cancellation badges
    if (subscriptionsCancelled > 0) {
      newBadges.push(BADGES.find(badge => badge.id === 'subscription-slayer')!);
    }
    
    return newBadges;
  },

  // Check and update user streak
  updateStreak(lastCheckTime: Date | null): { streak: number; isNewDay: boolean } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (!lastCheckTime) {
      return { streak: 1, isNewDay: true };
    }
    
    const lastCheck = new Date(lastCheckTime);
    const lastCheckDay = new Date(lastCheck.getFullYear(), lastCheck.getMonth(), lastCheck.getDate());
    
    // Calculate days difference
    const daysDiff = Math.floor((today.getTime() - lastCheckDay.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Same day, streak unchanged
      return { streak: 0, isNewDay: false };
    } else if (daysDiff === 1) {
      // Next day, streak continues
      return { streak: 1, isNewDay: true };
    } else {
      // More than one day passed, streak broken
      return { streak: 1, isNewDay: true };
    }
  },
};