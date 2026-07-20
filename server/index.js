import 'dotenv/config';
import express from 'express';
import app from './app.js';
import { initDB } from './db.js';

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await initDB();
    console.log('Connected to MongoDB');

    const server = express();
    server.use('/api', app);

    server.listen(PORT, () => {
      console.log(`API server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();
