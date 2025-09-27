// This service manages budget tracking functionality

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  period: BudgetPeriod;
  category: BudgetCategory;
  startDate: Date;
  endDate: Date;
  isRecurring: boolean;
}

export type BudgetPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
export type BudgetCategory = 
  | 'food' 
  | 'housing' 
  | 'transportation' 
  | 'entertainment' 
  | 'shopping' 
  | 'utilities' 
  | 'healthcare' 
  | 'education' 
  | 'personal' 
  | 'subscriptions' 
  | 'other';

// Sample budget categories with icons and colors
export const BUDGET_CATEGORIES = [
  { value: 'food', label: 'Food & Dining', icon: 'food', color: '#4CAF50' },
  { value: 'housing', label: 'Housing', icon: 'home', color: '#2196F3' },
  { value: 'transportation', label: 'Transportation', icon: 'car', color: '#FF9800' },
  { value: 'entertainment', label: 'Entertainment', icon: 'movie', color: '#9C27B0' },
  { value: 'shopping', label: 'Shopping', icon: 'shopping', color: '#E91E63' },
  { value: 'utilities', label: 'Utilities', icon: 'lightning-bolt', color: '#FFC107' },
  { value: 'healthcare', label: 'Healthcare', icon: 'medical-bag', color: '#F44336' },
  { value: 'education', label: 'Education', icon: 'school', color: '#673AB7' },
  { value: 'personal', label: 'Personal', icon: 'account', color: '#3F51B5' },
  { value: 'subscriptions', label: 'Subscriptions', icon: 'refresh', color: '#00BCD4' },
  { value: 'other', label: 'Other', icon: 'dots-horizontal', color: '#607D8B' }
];

// Sample budgets data
const sampleBudgets: Budget[] = [
  {
    id: '1',
    name: 'Monthly Food Budget',
    amount: 500,
    spent: 350,
    period: 'monthly',
    category: 'food',
    startDate: new Date(2024, 4, 1), // May 1, 2024
    endDate: new Date(2024, 4, 31), // May 31, 2024
    isRecurring: true,
  },
  {
    id: '2',
    name: 'Entertainment',
    amount: 200,
    spent: 150,
    period: 'monthly',
    category: 'entertainment',
    startDate: new Date(2024, 4, 1), // May 1, 2024
    endDate: new Date(2024, 4, 31), // May 31, 2024
    isRecurring: true,
  },
  {
    id: '3',
    name: 'Subscriptions',
    amount: 50,
    spent: 45,
    period: 'monthly',
    category: 'subscriptions',
    startDate: new Date(2024, 4, 1), // May 1, 2024
    endDate: new Date(2024, 4, 31), // May 31, 2024
    isRecurring: true,
  }
];

// Interface for spending activity
export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  category: BudgetCategory;
  description: string;
  budgetId?: string;
}

// Sample transactions
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    amount: 35,
    date: new Date(2024, 4, 2), // May 2, 2024
    category: 'food',
    description: 'Grocery shopping',
    budgetId: '1',
  },
  {
    id: '2',
    amount: 50,
    date: new Date(2024, 4, 5), // May 5, 2024
    category: 'entertainment',
    description: 'Movie tickets',
    budgetId: '2',
  },
  {
    id: '3',
    amount: 15,
    date: new Date(2024, 4, 8), // May 8, 2024
    category: 'food',
    description: 'Coffee shop',
    budgetId: '1',
  },
  {
    id: '4',
    amount: 12.99,
    date: new Date(2024, 4, 1), // May 1, 2024
    category: 'subscriptions',
    description: 'Music streaming service',
    budgetId: '3',
  }
];

export const BudgetService = {
  // Get all budgets
  getBudgets: async (): Promise<Budget[]> => {
    // In a real app, this would fetch from backend
    return sampleBudgets;
  },

  // Get a specific budget by ID
  getBudget: async (id: string): Promise<Budget | undefined> => {
    return sampleBudgets.find(budget => budget.id === id);
  },

  // Create a new budget
  createBudget: async (budget: Omit<Budget, 'id'>): Promise<Budget> => {
    // Generate a mock ID
    const newBudget: Budget = {
      ...budget,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    sampleBudgets.push(newBudget);
    return newBudget;
  },

  // Update an existing budget
  updateBudget: async (id: string, updates: Partial<Budget>): Promise<Budget> => {
    const budgetIndex = sampleBudgets.findIndex(budget => budget.id === id);
    
    if (budgetIndex === -1) {
      throw new Error('Budget not found');
    }
    
    const updatedBudget = {
      ...sampleBudgets[budgetIndex],
      ...updates,
    };
    
    sampleBudgets[budgetIndex] = updatedBudget;
    return updatedBudget;
  },

  // Delete a budget
  deleteBudget: async (id: string): Promise<void> => {
    const budgetIndex = sampleBudgets.findIndex(budget => budget.id === id);
    
    if (budgetIndex === -1) {
      throw new Error('Budget not found');
    }
    
    sampleBudgets.splice(budgetIndex, 1);
  },

  // Record a transaction
  addTransaction: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    sampleTransactions.push(newTransaction);
    
    // Update budget spent amount if budgetId provided
    if (transaction.budgetId) {
      const budget = sampleBudgets.find(b => b.id === transaction.budgetId);
      if (budget) {
        budget.spent += transaction.amount;
      }
    }
    
    return newTransaction;
  },

  // Get transactions
  getTransactions: async (): Promise<Transaction[]> => {
    return sampleTransactions;
  },

  // Calculate budget usage percentage
  calculateUsagePercentage: (spent: number, amount: number): number => {
    return Math.min(Math.round((spent / amount) * 100), 100);
  },

  // Get budget status (under, near, over)
  getBudgetStatus: (spent: number, amount: number): 'under' | 'near' | 'over' => {
    const percentage = (spent / amount) * 100;
    
    if (percentage > 100) return 'over';
    if (percentage > 80) return 'near';
    return 'under';
  },

  // Get category details
  getCategoryDetails: (category: BudgetCategory) => {
    return BUDGET_CATEGORIES.find(cat => cat.value === category) || BUDGET_CATEGORIES[10]; // Default to "Other"
  },

  // Get remaining amount in budget
  getRemainingAmount: (budget: Budget): number => {
    return Math.max(budget.amount - budget.spent, 0);
  },

  // Get amount spent in a particular category over a period
  getCategorySpending: async (
    category: BudgetCategory,
    startDate: Date,
    endDate: Date
  ): Promise<number> => {
    return sampleTransactions
      .filter(
        tx => 
          tx.category === category && 
          tx.date >= startDate && 
          tx.date <= endDate
      )
      .reduce((sum, tx) => sum + tx.amount, 0);
  },

  // Check if budget is active
  isBudgetActive: (budget: Budget): boolean => {
    const now = new Date();
    return budget.startDate <= now && budget.endDate >= now;
  }
};