import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import usersRouter from './routes/users.js';
import { User } from './models/User.js';
import { departments, roles } from '../src/data/dummyData.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is missing. Add it to server/.env');
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use('/api/users', usersRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

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

async function seedUsersIfEmpty() {
  const count = await User.countDocuments();
  if (count > 0) return;

  console.log('Database empty — seeding initial users from JSONPlaceholder...');
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Failed to seed users from JSONPlaceholder');
  }

  const placeholderUsers = await response.json();
  await User.insertMany(placeholderUsers.map(transformPlaceholderUser));
  console.log(`Seeded ${placeholderUsers.length} users.`);
}

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await seedUsersIfEmpty();

    app.listen(PORT, () => {
      console.log(`API server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();
