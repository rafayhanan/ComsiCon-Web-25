import express from 'express';
import {
  addTeamMember,
  getTeamMembers,
  removeTeamMember
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication and manager role
router.use(authenticate);
router.use(authorize('manager'));

// Team member management routes
router.post('/team-members', addTeamMember);
router.get('/team-members/:teamId', getTeamMembers);
router.delete('/team-members/:teamId/:userId', removeTeamMember);

export default router;