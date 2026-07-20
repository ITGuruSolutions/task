import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import usersRouter from './routes/users.js';

import { initDB } from './db.js';

const app = express();

app.use(cors());
app.use(express.json());

// Await database connection/seeding resolution for serverless compliance
app.use(async (req, res, next) => {
  try {
    await initDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/users', usersRouter);

app.use((error, _req, res, _next) => {
  console.error('API error:', error);
  res.status(500).json({
    message: error.message || 'Internal server error',
  });
});

export default app;
