/**
 * Mock data service for Centsi demo
 * This provides mock data for the MVP without needing a backend
 */

// Mock user profiles based on different life stages
export const mockProfiles = {
  highschool: {
    type: 'High School Student',
    income: { amount: 75, frequency: 'weekly', source: 'Allowance' },
    expenses: [
      { category: 'Entertainment', amount: 25 },
      { category: 'Food', amount: 15 },
      { category: 'Transportation', amount: 10 }
    ],
    savingsGoal: { name: 'College Fund', target: 5000, current: 1250 },
    nextMilestone: { name: 'Save $1500', reward: '15% College Prep Badge' }
  },
  college: {
    type: 'College Student',
    income: { amount: 250, frequency: 'bi-weekly', source: 'Part-time job' },
    expenses: [
      { category: 'Food', amount: 80 },
      { category: 'Books', amount: 60 },
      { category: 'Entertainment', amount: 40 },
      { category: 'Dorm supplies', amount: 30 }
    ],
    savingsGoal: { name: 'Spring Break Trip', target: 1200, current: 350 },
    nextMilestone: { name: 'Save $500', reward: 'Student Saver Badge' }
  },
  graduate: {
    type: 'Fresh Graduate',
    income: { amount: 3200, frequency: 'monthly', source: 'Salary' },
    expenses: [
      { category: 'Rent', amount: 1100 },
      { category: 'Student Loans', amount: 400 },
      { category: 'Groceries', amount: 350 },
      { category: 'Utilities', amount: 200 },
      { category: 'Transportation', amount: 150 }
    ],
    savingsGoal: { name: 'Emergency Fund', target: 10000, current: 1500 },
    nextMilestone: { name: 'Save $3000', reward: 'Financial Security Badge' }
  },
  parent: {
    type: 'Parent/Family Manager',
    income: { amount: 5500, frequency: 'monthly', source: 'Salary' },
    expenses: [
      { category: 'Mortgage', amount: 1800 },
      { category: 'Groceries', amount: 800 },
      { category: 'Childcare', amount: 1200 },
      { category: 'Utilities', amount: 350 },
      { category: 'Car payment', amount: 450 }
    ],
    savingsGoal: { name: 'Family Vacation', target: 5000, current: 2200 },
    nextMilestone: { name: 'Save $3000', reward: 'Family Planner Badge' }
  }
};

// Get user profile from localStorage or return default
export const getUserProfile = () => {
  const storedProfile = localStorage.getItem('centsi_user_profile');
  if (storedProfile) {
    return JSON.parse(storedProfile);
  }
  return mockProfiles.college; // Default to college student profile
};

// Get username from localStorage
export const getUsername = () => {
  return localStorage.getItem('centsi_username') || 'User';
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('centsi_auth') === 'true';
};