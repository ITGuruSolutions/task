import express from 'express';
import { initDB } from './db.js';
import app from './app.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initDB();
    console.log('Connected to MongoDB');

    const server = express();
    server.use(app);

    server.listen(PORT, () => {
      console.log(`API server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
  }
}

startServer();
