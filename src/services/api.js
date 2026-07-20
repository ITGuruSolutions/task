import axios from 'axios';

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design', 'Operations', 'Legal'];
const ROLES = [
  'Senior Developer',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'Marketing Manager',
  'Content Writer',
  'Sales Representative',
  'HR Specialist',
  'HR Manager',
  'Sales Manager',
];

// Helper to generate real 24-character MongoDB ObjectId hex strings
const generateObjectId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Math.floor(Math.random() * 1099511627775).toString(16).padStart(10, '0');
  const counter = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  return timestamp + random + counter;
};

// Helper to split full name from JSONPlaceholder
const splitName = (fullName) => {
  const cleanName = fullName.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s+/i, '');
  const parts = cleanName.split(' ');
  const firstName = parts[0] || 'Unknown';
  const lastName = parts.slice(1).join(' ') || 'User';
  return { firstName, lastName };
};

// Simulates network latency based on the slider value in localStorage
const simulateDelay = async () => {
  const latency = Number(localStorage.getItem('um_api_latency') || '500');
  if (latency > 0) {
    await new Promise((resolve) => setTimeout(resolve, latency));
  }
};

const getStoredUsers = () => {
  const data = localStorage.getItem('um_users');
  return data ? JSON.parse(data) : null;
};

const saveStoredUsers = (users) => {
  localStorage.setItem('um_users', JSON.stringify(users));
};

export const userApi = {
  getUsers: async () => {
    await simulateDelay();
    let users = getStoredUsers();

    if (!users) {
      try {
        const res = await axios.get('https://jsonplaceholder.typicode.com/users');
        users = res.data.map((user, idx) => {
          const { firstName, lastName } = splitName(user.name);
          return {
            id: generateObjectId(),
            firstName,
            lastName,
            email: user.email,
            department: DEPARTMENTS[idx % DEPARTMENTS.length],
            role: ROLES[idx % ROLES.length],
            status: idx % 3 === 0 ? 'Inactive' : 'Active',
            joinDate: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });
        saveStoredUsers(users);
      } catch (err) {
        console.error('Failed to fetch seed users:', err);
        users = [];
      }
    }
    return users;
  },

  getUser: async (id) => {
    await simulateDelay();
    const users = getStoredUsers() || [];
    const user = users.find((u) => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  },

  createUser: async (userData) => {
    await simulateDelay();
    const users = getStoredUsers() || [];
    const newId = generateObjectId();
    const newUser = {
      ...userData,
      id: newId,
      _id: newId,
      joinDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.unshift(newUser);
    saveStoredUsers(users);
    return newUser;
  },

  updateUser: async (id, userData) => {
    await simulateDelay();
    const users = getStoredUsers() || [];
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');

    const updatedUser = {
      ...users[index],
      ...userData,
      updatedAt: new Date().toISOString(),
    };
    users[index] = updatedUser;
    saveStoredUsers(users);
    return updatedUser;
  },

  deleteUser: async (id) => {
    await simulateDelay();
    const users = getStoredUsers() || [];
    const filtered = users.filter((u) => u.id !== id);
    saveStoredUsers(filtered);
    return id;
  },

  resetDatabase: async () => {
    await simulateDelay();
    localStorage.removeItem('um_users');
    const users = await userApi.getUsers();
    return { message: 'Database reset successfully', users };
  },
};

export default userApi;
