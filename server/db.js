import mongoose from 'mongoose';
import { User } from './models/User.js';
import { departments, roles } from '../src/data/dummyData.js';

const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not configured');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

const transformPlaceholderUser = (apiUser) => {
  const departmentIndex = (apiUser.id - 1) % departments.length;
  const roleIndex = (apiUser.id - 1) % roles.length;

  return {
    firstName: apiUser.name.split(' ')[0] || 'Unknown',
    lastName: apiUser.name.split(' ').slice(1).join(' ') || 'Unknown',
    email: apiUser.email,
    department: departments[departmentIndex],
    role: roles[roleIndex],
    status: apiUser.id % 5 === 0 ? 'Inactive' : 'Active',
    joinDate: new Date().toISOString().split('T')[0],
  };
};

export async function seedUsersIfEmpty() {
  const count = await User.countDocuments();
  if (count > 0) return;

  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Failed to seed users from JSONPlaceholder');
  }

  const placeholderUsers = await response.json();
  await User.insertMany(placeholderUsers.map(transformPlaceholderUser));
}

export async function initDB() {
  await connectDB();
  await seedUsersIfEmpty();
}
