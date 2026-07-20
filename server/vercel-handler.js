import app from './app.js';
import { initDB } from './db.js';

// Pre-initialize DB connection for serverless function environment
initDB().catch((err) => {
  console.error('Serverless DB connection error:', err);
});

export default app;
