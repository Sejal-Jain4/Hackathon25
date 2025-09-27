// This file contains a simple state management solution for the app using React Context
// For a more complex app, you might want to use Redux, Zustand, or another state management library

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define the types for our app state
interface AppState {
  // User
  user: UserState | null;
  
  // Goals
  goals: any[]; // We'll use the types from goals-service in a real implementation
  selectedGoalId: string | null;

  // Budget
  budgets: any[]; // We'll use the types from budget-service in a real implementation
  transactions: any[]; // We'll use the types from budget-service in a real implementation
  
  // Gamification
  xp: number;
  badges: any[]; // We'll use the types from gamification-service in a real implementation
  streak: number;
  lastCheckIn: Date | null;
  
  // Notifications
  notifications: any[]; // We'll use the types from notification-service in a real implementation
  unreadNotificationsCount: number;
  
  // UI State
  isOnboarded: boolean;
  isLoading: boolean;
  error: string | null;
}

// User state
interface UserState {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  studentId: string | null;
  university: string | null;
  yearOfStudy: number | null;
}

// Define action types
type ActionType = 
  | { type: 'SET_USER'; payload: UserState | null }
  | { type: 'SET_GOALS'; payload: any[] }
  | { type: 'SET_SELECTED_GOAL_ID'; payload: string | null }
  | { type: 'SET_BUDGETS'; payload: any[] }
  | { type: 'SET_TRANSACTIONS'; payload: any[] }
  | { type: 'SET_XP'; payload: number }
  | { type: 'SET_BADGES'; payload: any[] }
  | { type: 'SET_STREAK'; payload: number }
  | { type: 'SET_LAST_CHECK_IN'; payload: Date | null }
  | { type: 'SET_NOTIFICATIONS'; payload: any[] }
  | { type: 'SET_UNREAD_NOTIFICATIONS_COUNT'; payload: number }
  | { type: 'SET_IS_ONBOARDED'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: AppState = {
  user: null,
  goals: [],
  selectedGoalId: null,
  budgets: [],
  transactions: [],
  xp: 0,
  badges: [],
  streak: 0,
  lastCheckIn: null,
  notifications: [],
  unreadNotificationsCount: 0,
  isOnboarded: false,
  isLoading: false,
  error: null,
};

// Create the reducer
function appReducer(state: AppState, action: ActionType): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
    case 'SET_SELECTED_GOAL_ID':
      return { ...state, selectedGoalId: action.payload };
    case 'SET_BUDGETS':
      return { ...state, budgets: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_XP':
      return { ...state, xp: action.payload };
    case 'SET_BADGES':
      return { ...state, badges: action.payload };
    case 'SET_STREAK':
      return { ...state, streak: action.payload };
    case 'SET_LAST_CHECK_IN':
      return { ...state, lastCheckIn: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'SET_UNREAD_NOTIFICATIONS_COUNT':
      return { ...state, unreadNotificationsCount: action.payload };
    case 'SET_IS_ONBOARDED':
      return { ...state, isOnboarded: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// Create the context
interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<ActionType>;
}

const AppContext = createContext<AppContextProps>({
  state: initialState,
  dispatch: () => null,
});

// Create the provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Create a hook for accessing the context
export const useAppContext = () => useContext(AppContext);

// Create action creators for common operations
export const AppActions = {
  setUser: (user: UserState | null) => ({ 
    type: 'SET_USER' as const, 
    payload: user 
  }),
  
  setGoals: (goals: any[]) => ({ 
    type: 'SET_GOALS' as const, 
    payload: goals 
  }),
  
  setSelectedGoalId: (goalId: string | null) => ({ 
    type: 'SET_SELECTED_GOAL_ID' as const, 
    payload: goalId 
  }),
  
  setBudgets: (budgets: any[]) => ({ 
    type: 'SET_BUDGETS' as const, 
    payload: budgets 
  }),
  
  setTransactions: (transactions: any[]) => ({ 
    type: 'SET_TRANSACTIONS' as const, 
    payload: transactions 
  }),
  
  setXp: (xp: number) => ({ 
    type: 'SET_XP' as const, 
    payload: xp 
  }),
  
  setBadges: (badges: any[]) => ({ 
    type: 'SET_BADGES' as const, 
    payload: badges 
  }),
  
  setStreak: (streak: number) => ({ 
    type: 'SET_STREAK' as const, 
    payload: streak 
  }),
  
  setLastCheckIn: (date: Date | null) => ({ 
    type: 'SET_LAST_CHECK_IN' as const, 
    payload: date 
  }),
  
  setNotifications: (notifications: any[]) => ({ 
    type: 'SET_NOTIFICATIONS' as const, 
    payload: notifications 
  }),
  
  setUnreadNotificationsCount: (count: number) => ({ 
    type: 'SET_UNREAD_NOTIFICATIONS_COUNT' as const, 
    payload: count 
  }),
  
  setIsOnboarded: (isOnboarded: boolean) => ({ 
    type: 'SET_IS_ONBOARDED' as const, 
    payload: isOnboarded 
  }),
  
  setLoading: (isLoading: boolean) => ({ 
    type: 'SET_LOADING' as const, 
    payload: isLoading 
  }),
  
  setError: (error: string | null) => ({ 
    type: 'SET_ERROR' as const, 
    payload: error 
  }),
};