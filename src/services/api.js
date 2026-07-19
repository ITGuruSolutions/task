import axios from 'axios';
import { departments, roles } from '../data/dummyData';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const transformUser = (apiUser) => {
  const departmentIndex = (apiUser.id - 1) % departments.length;
  const roleIndex = (apiUser.id - 1) % roles.length;

  return {
    id: apiUser.id,
    firstName: apiUser.name.split(' ')[0] || 'Unknown',
    lastName: apiUser.name.split(' ').slice(1).join(' ') || 'Unknown',
    email: apiUser.email,
    department: departments[departmentIndex],
    role: roles[roleIndex],
    status: apiUser.id % 5 === 0 ? 'Inactive' : 'Active',
    joinDate: new Date().toISOString().split('T')[0],
  };
};

export const userApi = {
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data.map(transformUser);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getUser: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return transformUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return { ...userData, id: response.data.id || Date.now() };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      await api.put(`/users/${id}`, userData);
      return { ...userData, id };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};

export default api;
