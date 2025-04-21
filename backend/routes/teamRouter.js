import express from 'express';
import {
  createTeam,
  getManagedTeams,
  getTeamById,
  updateTeam,
  deleteTeam
} from '../controllers/teamController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Routes for managers only
router.post('/', authorize('manager'), createTeam);
router.get('/managed', authorize('manager'), getManagedTeams);
router.put('/:teamId', authorize('manager'), updateTeam);
router.delete('/:teamId', authorize('manager'), deleteTeam);

// Route for both managers and team members
router.get('/:teamId', authenticate, getTeamById);

export default router;