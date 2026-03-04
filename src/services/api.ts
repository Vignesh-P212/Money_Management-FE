import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data: { name: string; email: string; password: string }) =>
  api.post('/auth/register', data);

export const loginUser = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

// Assets
export const getAssets = () => api.get('/assets');
export const createAsset = (data: { name: string; type: string; value: number }) =>
  api.post('/assets', data);
export const updateAsset = (id: string, data: Partial<{ name: string; type: string; value: number }>) =>
  api.put(`/assets/${id}`, data);
export const deleteAsset = (id: string) => api.delete(`/assets/${id}`);

// Liabilities
export const getLiabilities = () => api.get('/liabilities');
export const createLiability = (data: { name: string; type: string; amount: number; interestRate?: number }) =>
  api.post('/liabilities', data);
export const updateLiability = (id: string, data: Partial<{ name: string; type: string; amount: number; interestRate: number }>) =>
  api.put(`/liabilities/${id}`, data);
export const deleteLiability = (id: string) => api.delete(`/liabilities/${id}`);

// Transactions
export const getTransactions = (params?: { month?: number; year?: number }) =>
  api.get('/transactions', { params });
export const createTransaction = (data: { type: string; category: string; amount: number; date?: string; recurring?: boolean }) =>
  api.post('/transactions', data);
export const updateTransaction = (id: string, data: any) => api.put(`/transactions/${id}`, data);
export const deleteTransaction = (id: string) => api.delete(`/transactions/${id}`);

// Goals
export const getGoals = () => api.get('/goals');
export const createGoal = (data: { title: string; targetAmount: number; currentAmount?: number; deadline: string }) =>
  api.post('/goals', data);
export const updateGoal = (id: string, data: any) => api.put(`/goals/${id}`, data);
export const deleteGoal = (id: string) => api.delete(`/goals/${id}`);

// Insights
export const getInsights = () => api.get('/insights');

export default api;
