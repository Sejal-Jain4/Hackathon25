import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Base API configuration
const api = axios.create({
  // In a real app, this would be your backend API URL
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to each request
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string, studentType: string) => {
    const response = await api.post('/auth/register', { 
      name, 
      email, 
      password,
      studentType
    });
    return response.data;
  },
  logout: async () => {
    await api.post('/auth/logout');
  },
};

export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  updateProfile: async (userData: any) => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },
};

export const goalsAPI = {
  getAll: async () => {
    const response = await api.get('/goals');
    return response.data;
  },
  create: async (goalData: any) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },
  update: async (id: string, goalData: any) => {
    const response = await api.put(`/goals/${id}`, goalData);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/goals/${id}`);
  },
};

export const transactionsAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },
  getInsights: async () => {
    const response = await api.get('/transactions/insights');
    return response.data;
  },
};

export const aiAPI = {
  sendMessage: async (message: string) => {
    const response = await api.post('/ai/chat', { message });
    return response.data;
  },
  getFinancialAdvice: async (query: string) => {
    const response = await api.post('/ai/advice', { query });
    return response.data;
  },
};

export default api;