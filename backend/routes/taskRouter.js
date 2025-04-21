import express from 'express';
import {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all task routes
router.use(authenticate);

// POST /api/tasks - Create a new task
router.post('/', authorize('manager'), createTask);
// DELETE /api/tasks/:taskId - Delete a task
router.delete('/:taskId', authorize('manager'), deleteTask);



// GET /api/tasks/project/:projectId - Get all tasks for a specific project
router.get('/project/:projectId', getTasksByProject);
// GET /api/tasks/:taskId - Get a single task by ID
router.get('/:taskId', getTaskById);
// PUT /api/tasks/:taskId - Update a task (status, assignment, details)
router.put('/:taskId', updateTask);


export default router;
