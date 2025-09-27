import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  name: string;
  email: string;
  studentType: 'high_school' | 'college_dorm' | 'working_student' | 'graduate';
  xpPoints: number;
  level: number;
  streak: number;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    studentType: 'high_school' | 'college_dorm' | 'working_student' | 'graduate'
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load stored user when the app starts
    async function loadStoredUser() {
      try {
        const storedUser = await SecureStore.getItemAsync('user');
        const storedToken = await SecureStore.getItemAsync('token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadStoredUser();
  }, []);

  async function login(email: string, password: string): Promise<void> {
    setLoading(true);
    try {
      // In a real app, we would make an API request to our backend
      // For the hackathon, let's simulate a successful login
      
      // This would be replaced with actual API call
      // const response = await api.post('/auth/login', { email, password });
      
      // Simulate successful login for demo
      const mockUser: User = {
        id: '1',
        name: 'Demo User',
        email: email,
        studentType: 'college_dorm',
        xpPoints: 120,
        level: 3,
        streak: 5
      };
      
      const mockToken = 'mock-jwt-token';
      
      // Store user data and token in secure storage
      await SecureStore.setItemAsync('user', JSON.stringify(mockUser));
      await SecureStore.setItemAsync('token', mockToken);
      
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function register(
    name: string,
    email: string,
    password: string,
    studentType: 'high_school' | 'college_dorm' | 'working_student' | 'graduate'
  ): Promise<void> {
    setLoading(true);
    try {
      // In a real app, we would make an API request to our backend
      // For the hackathon, let's simulate a successful registration
      
      // This would be replaced with actual API call
      // const response = await api.post('/auth/register', { name, email, password, studentType });
      
      // Simulate successful registration for demo
      const mockUser: User = {
        id: '1',
        name: name,
        email: email,
        studentType: studentType,
        xpPoints: 0,
        level: 1,
        streak: 0
      };
      
      const mockToken = 'mock-jwt-token';
      
      // Store user data and token in secure storage
      await SecureStore.setItemAsync('user', JSON.stringify(mockUser));
      await SecureStore.setItemAsync('token', mockToken);
      
      setUser(mockUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function logout(): Promise<void> {
    try {
      // Clear stored data
      await SecureStore.deleteItemAsync('user');
      await SecureStore.deleteItemAsync('token');
      
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}