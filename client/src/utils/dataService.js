/**
 * Enhanced data service for Centsi app
 * Provides a flexible interface for managing financial data
 * Works with both mock data and real user-provided data
 */

import { mockProfiles } from './mockDataService';

// Keys for localStorage
const STORAGE_KEYS = {
  USER_PROFILE: 'centsi_user_profile',
  USERNAME: 'centsi_username',
  AUTH: 'centsi_auth',
  QUESTIONNAIRE: 'centsi_questionnaire_responses',
  FINANCIAL_DATA: 'centsi_financial_data'
};

/**
 * Get complete user profile data including questionnaire responses and financial data
 */
export const getCompleteUserData = () => {
  const userProfile = getUserProfile();
  const questionnaireResponses = getQuestionnaireResponses();
  const financialData = getFinancialData();
  
  return {
    profile: userProfile,
    questionnaire: questionnaireResponses,
    finances: financialData
  };
};

/**
 * Get user profile from localStorage or return default
 */
export const getUserProfile = () => {
  const storedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (storedProfile) {
    return JSON.parse(storedProfile);
  }
  
  // Check if questionnaire exists to determine which mock profile to use
  const questionnaireResponses = getQuestionnaireResponses();
  if (questionnaireResponses && questionnaireResponses.lifeStage) {
    return mockProfiles[questionnaireResponses.lifeStage] || mockProfiles.college;
  }
  
  return mockProfiles.college; // Default to college student profile
};

/**
 * Get questionnaire responses from localStorage
 */
export const getQuestionnaireResponses = () => {
  const storedQuestionnaire = localStorage.getItem(STORAGE_KEYS.QUESTIONNAIRE);
  return storedQuestionnaire ? JSON.parse(storedQuestionnaire) : null;
};

/**
 * Get username from localStorage
 */
export const getUsername = () => {
  return localStorage.getItem(STORAGE_KEYS.USERNAME) || 'User';
};

/**
 * Get financial data from localStorage or generate from user profile
 */
export const getFinancialData = () => {
  const storedFinancialData = localStorage.getItem(STORAGE_KEYS.FINANCIAL_DATA);
  if (storedFinancialData) {
    return JSON.parse(storedFinancialData);
  }
  
  // If no stored data exists, generate from user profile
  const userProfile = getUserProfile();
  
  // Extract relevant data from user profile without including any default savings goals
  const financialData = {
    income: userProfile.income || { amount: 0, frequency: 'monthly', source: 'Unspecified' },
    expenses: userProfile.expenses || [],
    savingsGoals: [], // Start with empty savings goals - users will add their own
    totalBalance: calculateBalance(userProfile)
  };
  
  return financialData;
};

/**
 * Calculate balance from income and expenses
 */
const calculateBalance = (profile) => {
  let incomeAmount = profile.income ? profile.income.amount : 0;
  const frequency = profile.income ? profile.income.frequency : 'monthly';
  
  // Convert to monthly equivalent
  if (frequency === 'weekly') {
    incomeAmount = incomeAmount * 4;
  } else if (frequency === 'bi-weekly') {
    incomeAmount = incomeAmount * 2;
  } else if (frequency === 'annually') {
    incomeAmount = incomeAmount / 12;
  }
  
  const expenses = profile.expenses || [];
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return incomeAmount - totalExpenses;
};

/**
 * Save complete financial data
 */
export const saveFinancialData = (data) => {
  localStorage.setItem(STORAGE_KEYS.FINANCIAL_DATA, JSON.stringify(data));
  return data;
};

/**
 * Add a new income source
 */
export const addIncome = (incomeData) => {
  const financialData = getFinancialData();
  
  // Replace the income if it's a single object, or add to array if we support multiple income sources
  financialData.income = incomeData;
  financialData.totalBalance = calculateBalance({
    income: incomeData,
    expenses: financialData.expenses
  });
  
  return saveFinancialData(financialData);
};

/**
 * Add a new expense
 */
export const addExpense = (expenseData) => {
  const financialData = getFinancialData();
  
  // Add to expenses array
  financialData.expenses.push(expenseData);
  financialData.totalBalance = calculateBalance({
    income: financialData.income,
    expenses: financialData.expenses
  });
  
  return saveFinancialData(financialData);
};

/**
 * Update an expense
 */
export const updateExpense = (index, expenseData) => {
  const financialData = getFinancialData();
  
  // Update expense at index
  if (index >= 0 && index < financialData.expenses.length) {
    financialData.expenses[index] = expenseData;
    financialData.totalBalance = calculateBalance({
      income: financialData.income,
      expenses: financialData.expenses
    });
  }
  
  return saveFinancialData(financialData);
};

/**
 * Remove an expense
 */
export const removeExpense = (index) => {
  const financialData = getFinancialData();
  
  // Remove expense at index
  if (index >= 0 && index < financialData.expenses.length) {
    financialData.expenses.splice(index, 1);
    financialData.totalBalance = calculateBalance({
      income: financialData.income,
      expenses: financialData.expenses
    });
  }
  
  return saveFinancialData(financialData);
};

/**
 * Add a new savings goal
 */
export const addSavingsGoal = (goalData) => {
  const financialData = getFinancialData();
  
  // Initialize savingsGoals array if it doesn't exist
  if (!financialData.savingsGoals) {
    financialData.savingsGoals = [];
  }
  
  // Add to savings goals array
  financialData.savingsGoals.push(goalData);
  
  return saveFinancialData(financialData);
};

/**
 * Update a savings goal
 */
export const updateSavingsGoal = (index, goalData) => {
  const financialData = getFinancialData();
  
  // Initialize savingsGoals array if it doesn't exist
  if (!financialData.savingsGoals) {
    financialData.savingsGoals = [];
  }
  
  // Update goal at index
  if (index >= 0 && index < financialData.savingsGoals.length) {
    financialData.savingsGoals[index] = goalData;
  }
  
  return saveFinancialData(financialData);
};

/**
 * Delete a savings goal
 */
export const removeSavingsGoal = (index) => {
  const financialData = getFinancialData();
  
  // Initialize savingsGoals array if it doesn't exist
  if (!financialData.savingsGoals) {
    financialData.savingsGoals = [];
    return financialData;
  }
  
  // Remove goal at index
  if (index >= 0 && index < financialData.savingsGoals.length) {
    financialData.savingsGoals.splice(index, 1);
  }
  
  return saveFinancialData(financialData);
};

/**
 * Generate a financial report
 */
export const generateFinancialReport = () => {
  const financialData = getFinancialData();
  const username = getUsername();
  const questionnaireResponses = getQuestionnaireResponses();
  
  // Calculate useful metrics
  const totalExpenses = financialData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const income = financialData.income.amount;
  let incomeMonthly = income;
  
  // Convert income to monthly
  if (financialData.income.frequency === 'weekly') {
    incomeMonthly = income * 4;
  } else if (financialData.income.frequency === 'bi-weekly') {
    incomeMonthly = income * 2;
  } else if (financialData.income.frequency === 'annually') {
    incomeMonthly = income / 12;
  }
  
  const savingsRate = ((incomeMonthly - totalExpenses) / incomeMonthly) * 100;
  const expenseBreakdown = {};
  
  // Group expenses by category
  financialData.expenses.forEach(expense => {
    if (!expenseBreakdown[expense.category]) {
      expenseBreakdown[expense.category] = 0;
    }
    expenseBreakdown[expense.category] += expense.amount;
  });
  
  // Find top expense categories
  const topExpenseCategories = Object.entries(expenseBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  // Find savings goals progress
  const savingsGoals = financialData.savingsGoals || [];
  const savingsGoalsProgress = savingsGoals.map(goal => ({
    name: goal.name,
    target: goal.target,
    current: goal.current,
    progress: goal.current / goal.target * 100
  }));
  
  return {
    username,
    lifeStage: questionnaireResponses?.lifeStage || 'Unknown',
    incomeMonthly,
    totalExpenses,
    balance: financialData.totalBalance,
    savingsRate,
    expenseBreakdown,
    topExpenseCategories,
    savingsGoalsProgress,
    reportDate: new Date().toISOString()
  };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
};