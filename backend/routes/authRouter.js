import express from 'express';
import {
  registerManager,
  login,
  getCurrentUser
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerManager);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

export default router;