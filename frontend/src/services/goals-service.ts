// This service manages the user's financial goals

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | null;
  category: GoalCategory;
  isCompleted: boolean;
  createdAt: Date;
  colorTag: string;
}

export type GoalCategory = 
  | 'savings' 
  | 'debt_repayment' 
  | 'emergency_fund' 
  | 'education' 
  | 'travel' 
  | 'housing' 
  | 'other';

// Sample goal categories with icons and colors
export const GOAL_CATEGORIES = [
  { value: 'savings', label: 'Savings', icon: 'piggy-bank', color: '#4CAF50' },
  { value: 'debt_repayment', label: 'Debt Repayment', icon: 'credit-card-off', color: '#F44336' },
  { value: 'emergency_fund', label: 'Emergency Fund', icon: 'shield', color: '#2196F3' },
  { value: 'education', label: 'Education', icon: 'school', color: '#9C27B0' },
  { value: 'travel', label: 'Travel', icon: 'airplane', color: '#FF9800' },
  { value: 'housing', label: 'Housing', icon: 'home', color: '#795548' },
  { value: 'other', label: 'Other', icon: 'star', color: '#607D8B' },
];

// Sample goals data
const sampleGoals: Goal[] = [
  {
    id: '1',
    title: 'Emergency Fund',
    description: 'Build a 3-month emergency fund',
    targetAmount: 3000,
    currentAmount: 1500,
    deadline: new Date(2024, 11, 31), // Dec 31, 2024
    category: 'emergency_fund',
    isCompleted: false,
    createdAt: new Date(2024, 3, 1), // Apr 1, 2024
    colorTag: '#2196F3',
  },
  {
    id: '2',
    title: 'Summer Trip',
    description: 'Save for summer vacation',
    targetAmount: 1200,
    currentAmount: 800,
    deadline: new Date(2024, 6, 1), // Jul 1, 2024
    category: 'travel',
    isCompleted: false,
    createdAt: new Date(2024, 1, 15), // Feb 15, 2024
    colorTag: '#FF9800',
  },
  {
    id: '3',
    title: 'Pay off Credit Card',
    description: 'Clear credit card debt',
    targetAmount: 2500,
    currentAmount: 1800,
    deadline: new Date(2024, 8, 30), // Sep 30, 2024
    category: 'debt_repayment',
    isCompleted: false,
    createdAt: new Date(2024, 0, 1), // Jan 1, 2024
    colorTag: '#F44336',
  },
];

export const GoalsService = {
  // Get all goals
  getGoals: async (): Promise<Goal[]> => {
    // In a real app, this would fetch from the backend
    return sampleGoals;
  },

  // Get a specific goal by ID
  getGoal: async (id: string): Promise<Goal | undefined> => {
    return sampleGoals.find(goal => goal.id === id);
  },

  // Create a new goal
  createGoal: async (goal: Omit<Goal, 'id' | 'createdAt' | 'isCompleted'>): Promise<Goal> => {
    // Generate a mock ID (in a real app, this would be done by the backend)
    const newGoal: Goal = {
      ...goal,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      isCompleted: false,
    };
    
    // In a real app, this would send to the backend
    sampleGoals.push(newGoal);
    return newGoal;
  },

  // Update an existing goal
  updateGoal: async (id: string, updates: Partial<Goal>): Promise<Goal> => {
    const goalIndex = sampleGoals.findIndex(goal => goal.id === id);
    
    if (goalIndex === -1) {
      throw new Error('Goal not found');
    }
    
    const updatedGoal = {
      ...sampleGoals[goalIndex],
      ...updates,
    };
    
    sampleGoals[goalIndex] = updatedGoal;
    return updatedGoal;
  },

  // Delete a goal
  deleteGoal: async (id: string): Promise<void> => {
    const goalIndex = sampleGoals.findIndex(goal => goal.id === id);
    
    if (goalIndex === -1) {
      throw new Error('Goal not found');
    }
    
    sampleGoals.splice(goalIndex, 1);
  },

  // Update goal progress (add money to goal)
  updateGoalProgress: async (id: string, amount: number): Promise<Goal> => {
    const goal = sampleGoals.find(g => g.id === id);
    
    if (!goal) {
      throw new Error('Goal not found');
    }
    
    const newAmount = goal.currentAmount + amount;
    const isCompleted = newAmount >= goal.targetAmount;
    
    const updatedGoal = {
      ...goal,
      currentAmount: newAmount,
      isCompleted,
    };
    
    // Update the goal in our sample data
    const goalIndex = sampleGoals.findIndex(g => g.id === id);
    sampleGoals[goalIndex] = updatedGoal;
    
    return updatedGoal;
  },
  
  // Get goal category details
  getCategoryDetails: (category: GoalCategory) => {
    return GOAL_CATEGORIES.find(cat => cat.value === category) || GOAL_CATEGORIES[6]; // Default to "Other"
  },

  // Calculate goal progress percentage
  calculateProgress: (currentAmount: number, targetAmount: number): number => {
    return Math.min(Math.round((currentAmount / targetAmount) * 100), 100);
  },
  
  // Get time remaining for a goal
  getTimeRemaining: (deadline: Date | null): string => {
    if (!deadline) return 'No deadline';
    
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day left';
    if (diffDays < 30) return `${diffDays} days left`;
    
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return '1 month left';
    if (diffMonths < 12) return `${diffMonths} months left`;
    
    const diffYears = Math.floor(diffMonths / 12);
    if (diffYears === 1) return '1 year left';
    return `${diffYears} years left`;
  }
};