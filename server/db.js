import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { User, setUseInMemory } from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI;

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

const splitName = (fullName) => {
  const cleanName = fullName.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s+/i, '');
  const parts = cleanName.split(' ');
  const firstName = parts[0] || 'Unknown';
  const lastName = parts.slice(1).join(' ') || 'User';
  return { firstName, lastName };
};

export const seedUsersIfEmpty = async () => {
  try {
    const count = await User.countDocuments({});
    if (count === 0) {
      console.log('Database is empty. Seeding users from JSONPlaceholder...');
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      
      const seedUsers = response.data.map((user, index) => {
        const { firstName, lastName } = splitName(user.name);
        return {
          firstName,
          lastName,
          email: user.email,
          department: DEPARTMENTS[index % DEPARTMENTS.length],
          role: ROLES[index % ROLES.length],
          status: index % 3 === 0 ? 'Inactive' : 'Active',
          joinDate: new Date().toISOString().split('T')[0],
        };
      });

      await User.insertMany(seedUsers);
      console.log('Database successfully seeded!');
    }
  } catch (error) {
    console.error('Seeding failed:', error.message);
  }
};

let dbConnectPromise = null;

export const initDB = async () => {
  if (!dbConnectPromise) {
    dbConnectPromise = (async () => {
      if (!MONGO_URI) {
        console.error('Error: MONGO_URI env variable is missing.');
        console.log('Falling back to in-memory mock database.');
        setUseInMemory(true);
        await seedUsersIfEmpty();
        return;
      }

      try {
        await mongoose.connect(MONGO_URI, {
          serverSelectionTimeoutMS: 5000,
        });
        // Force server selection check by pinging the admin database
        await mongoose.connection.db.admin().ping();
        setUseInMemory(false);
        await seedUsersIfEmpty();
      } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        console.log('Falling back to in-memory mock database.');
        setUseInMemory(true);
        // Clean up connections if they were initiated but failed
        try {
          await mongoose.disconnect();
        } catch {
          // ignore disconnect errors
        }
        await seedUsersIfEmpty();
      }
    })();
  }
  return dbConnectPromise;
};
