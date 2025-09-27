// This service provides analytics and insights on the user's financial data

import { Transaction } from './budget-service';

export interface SpendingBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface TrendDataPoint {
  date: Date;
  value: number;
}

export interface InsightMessage {
  id: string;
  title: string;
  message: string;
  type: 'tip' | 'warning' | 'achievement';
  timestamp: Date;
  isRead: boolean;
}

// Sample insight messages
const sampleInsights: InsightMessage[] = [
  {
    id: '1',
    title: 'Unusual Spending Detected',
    message: 'Your food spending is 30% higher than last month. Tap to see where you can cut back.',
    type: 'warning',
    timestamp: new Date(2024, 4, 10), // May 10, 2024
    isRead: false,
  },
  {
    id: '2',
    title: 'Save on Subscriptions',
    message: 'You have 3 streaming subscriptions totaling $35/month. Consider consolidating to save money.',
    type: 'tip',
    timestamp: new Date(2024, 4, 8), // May 8, 2024
    isRead: true,
  },
  {
    id: '3',
    title: 'Budget Goal Achieved',
    message: 'You stayed under your entertainment budget for 3 months in a row!',
    type: 'achievement',
    timestamp: new Date(2024, 4, 5), // May 5, 2024
    isRead: true,
  }
];

// Sample spending data for this month
const sampleSpendingData = [
  { category: 'Food & Dining', amount: 350, percentage: 35, color: '#4CAF50' },
  { category: 'Housing', amount: 250, percentage: 25, color: '#2196F3' },
  { category: 'Transportation', amount: 150, percentage: 15, color: '#FF9800' },
  { category: 'Entertainment', amount: 100, percentage: 10, color: '#9C27B0' },
  { category: 'Shopping', amount: 80, percentage: 8, color: '#E91E63' },
  { category: 'Other', amount: 70, percentage: 7, color: '#607D8B' },
];

// Sample spending trends over months
const sampleSpendingTrends = [
  { date: new Date(2024, 0, 1), value: 950 }, // Jan
  { date: new Date(2024, 1, 1), value: 900 }, // Feb
  { date: new Date(2024, 2, 1), value: 880 }, // Mar
  { date: new Date(2024, 3, 1), value: 920 }, // Apr
  { date: new Date(2024, 4, 1), value: 1000 }, // May
];

// Sample saving trends over months
const sampleSavingTrends = [
  { date: new Date(2024, 0, 1), value: 100 }, // Jan
  { date: new Date(2024, 1, 1), value: 120 }, // Feb
  { date: new Date(2024, 2, 1), value: 140 }, // Mar
  { date: new Date(2024, 3, 1), value: 135 }, // Apr
  { date: new Date(2024, 4, 1), value: 150 }, // May
];

export const AnalyticsService = {
  // Get spending breakdown by category
  getSpendingBreakdown: async (): Promise<SpendingBreakdown[]> => {
    // In a real app, this would calculate from actual transaction data
    return sampleSpendingData;
  },

  // Get spending trends over time
  getSpendingTrends: async (): Promise<TrendDataPoint[]> => {
    return sampleSpendingTrends;
  },

  // Get saving trends over time
  getSavingTrends: async (): Promise<TrendDataPoint[]> => {
    return sampleSavingTrends;
  },

  // Get personalized insights
  getInsights: async (): Promise<InsightMessage[]> => {
    return sampleInsights;
  },

  // Mark an insight as read
  markInsightAsRead: async (id: string): Promise<void> => {
    const insight = sampleInsights.find(i => i.id === id);
    if (insight) {
      insight.isRead = true;
    }
  },

  // Generate new insights based on transaction data
  generateInsights: async (transactions: Transaction[]): Promise<InsightMessage[]> => {
    // In a real app, this would have more sophisticated algorithms
    // For the hackathon, we'll return sample insights
    return sampleInsights;
  },

  // Calculate monthly spending
  calculateMonthlySpending: async (month: number, year: number): Promise<number> => {
    // In a real app, this would sum actual transactions for the month
    return sampleSpendingTrends.find(
      t => t.date.getMonth() === month && t.date.getFullYear() === year
    )?.value || 0;
  },

  // Get transactions by category
  getTransactionsByCategory: async (
    category: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> => {
    // In a real app, this would filter actual transactions
    return [];
  },

  // Calculate average spending per day
  calculateDailyAverage: async (
    startDate: Date,
    endDate: Date
  ): Promise<number> => {
    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Mock calculation for hackathon
    const totalSpending = 1000; // Would be calculated from real transactions
    
    return totalSpending / totalDays;
  },

  // Calculate spending change compared to previous period
  calculateSpendingChange: async (
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    previousPeriodStart: Date,
    previousPeriodEnd: Date
  ): Promise<{ amount: number; percentage: number }> => {
    // Mock data for hackathon
    const currentSpending = 1000;
    const previousSpending = 950;
    
    const difference = currentSpending - previousSpending;
    const percentage = previousSpending ? (difference / previousSpending) * 100 : 0;
    
    return {
      amount: difference,
      percentage,
    };
  },

  // Get recurring expenses (subscriptions, bills, etc.)
  getRecurringExpenses: async (): Promise<Transaction[]> => {
    // In a real app, this would analyze transaction patterns
    return [];
  },

  // Get top spending categories
  getTopSpendingCategories: async (
    limit: number = 3
  ): Promise<SpendingBreakdown[]> => {
    return sampleSpendingData
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);
  }
};