import app from '../server/app.js';
import { initDB } from '../server/db.js';

// Pre-initialize DB connection for serverless function environment
initDB().catch((err) => {
  console.error('Serverless DB connection error:', err);
});

export default app;
