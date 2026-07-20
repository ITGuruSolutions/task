import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.js';
import { initDB } from './db.js';
import mongoose from 'mongoose';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

app.use(async (_req, _res, next) => {
  try {
    await initDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/users', usersRouter);

app.use((error, _req, res, _next) => {
  console.error('API error:', error);
  res.status(500).json({
    message: error.message || 'Internal server error',
  });
});

export default app;
