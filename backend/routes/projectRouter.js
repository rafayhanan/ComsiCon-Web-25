import express from 'express';
import {
  createProject,
  getManagedProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();


router.use(authenticate);

// Routes requiring Manager role

// POST /api/projects - Create a new project
router.post('/', authorize('manager'), createProject);
// GET /api/projects/managed - Get projects managed by the current user
router.get('/managed', authorize('manager'), getManagedProjects);
// PUT /api/projects/:projectId - Update a project
router.put('/:projectId', authorize('manager'), updateProject);
// DELETE /api/projects/:projectId - Delete a project
router.delete('/:projectId', authorize('manager'), deleteProject);


router.get('/:projectId', getProjectById);


export default router;
