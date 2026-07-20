import { Router } from 'express';
import { User } from '../models/User.js';
import { seedUsersIfEmpty } from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: 1 });
    res.json(users);
  } catch (error) {
    console.error('GET /users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('GET /users/:id error:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('POST /users error:', error);
    res.status(400).json({ message: error.message || 'Failed to create user' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('PUT /users/:id error:', error);
    res.status(400).json({ message: error.message || 'Failed to update user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: req.params.id });
  } catch (error) {
    console.error('DELETE /users/:id error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

router.post('/reset', async (req, res) => {
  try {
    await User.deleteMany({});
    await seedUsersIfEmpty();
    res.json({ message: 'Database reset successfully' });
  } catch (error) {
    console.error('POST /users/reset error:', error);
    res.status(500).json({ message: 'Failed to reset database' });
  }
});

export default router;
