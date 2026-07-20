import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const latency = Number(localStorage.getItem('um_api_latency') || '500');
  if (latency > 0) {
    await new Promise((resolve) => setTimeout(resolve, latency));
  }
  return config;
});

const getErrorMessage = (error) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.status === 404) return 'API endpoint not found. Is the backend deployed?';
  if (!error.response) return 'Cannot reach the API server. Check deployment and environment variables.';
  return error.message || 'Request failed';
};

export const userApi = {
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', getErrorMessage(error));
      throw new Error(getErrorMessage(error));
    }
  },

  getUser: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', getErrorMessage(error));
      throw new Error(getErrorMessage(error));
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', getErrorMessage(error));
      throw new Error(getErrorMessage(error));
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', getErrorMessage(error));
      throw new Error(getErrorMessage(error));
    }
  },

  deleteUser: async (id) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (error) {
      console.error('Error deleting user:', getErrorMessage(error));
      throw new Error(getErrorMessage(error));
    }
  },

  resetDatabase: async () => {
    try {
      const response = await api.post('/users/reset');
      return response.data;
    } catch (error) {
      console.error('Error resetting database:', getErrorMessage(error));
      throw new Error(getErrorMessage(error));
    }
  },
};

export default api;
