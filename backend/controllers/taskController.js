import Task from '../models/Task.js';
import Project from '../models/Project.js'; // Need Project model to link tasks and validate access/members
import Team from '../models/Team.js'; // Need Team model to get members from project's team
import User from '../models/User.js'; // Need User model for population

// Helper function to check if a user is a member of a team (copied from projectController)
const isTeamMember = (team, userId) => {
    if (!team || !team.memberIds) return false;
    return team.memberIds.some(memberId => memberId.toString() === userId.toString());
};

// Helper function to check if a user is assigned to a task
const isTaskAssigned = (task, userId) => {
    if (!task || !task.assignedUserIds) return false;
    return task.assignedUserIds.some(assignedId => assignedId.toString() === userId.toString());
};


// @desc Create a new task for a project
// @route POST /api/tasks
// @access Private/Manager
export const createTask = async (req, res) => {
  try {
    const { projectId, title, description, assignedUserIds, deadline, priority } = req.body;
    const createdBy = req.user._id; // Manager ID from authenticated user

    // Validate projectId: Ensure the project exists and the requesting user is its manager
    const project = await Project.findOne({ _id: projectId, managerId: createdBy })
        .populate('teamId', 'memberIds'); // Populate teamId to check assignedUserIds against team members

    if (!project) {
      return res.status(404).json({ message: 'Project not found or you are not authorized to add tasks to it' });
    }

    // Validate assignedUserIds: Ensure all assigned users exist and are members of the project's linked team
    if (assignedUserIds && assignedUserIds.length > 0) {
        const assignedUsers = await User.find({ _id: { $in: assignedUserIds } });

        if (assignedUsers.length !== assignedUserIds.length) {
            return res.status(400).json({ message: 'One or more assigned users not found' });
        }

        // Check if all assigned users are members of the project's team
        const team = project.teamId; // The populated team object
        if (!team) {
             // This case should ideally not happen if project validation passes, but good to check
             return res.status(500).json({ message: 'Project is not linked to a team' });
        }

        const nonTeamMembers = assignedUserIds.filter(userId => !isTeamMember(team, userId));

        if (nonTeamMembers.length > 0) {
            // Optional: Fetch names/emails of non-team members for a more informative error
            // const nonTeamMemberDetails = await User.find({ _id: { $in: nonTeamMembers } }, 'fullName email');
            return res.status(400).json({ message: 'One or more assigned users are not members of the project\'s team' });
        }
    }


    // Create the new task
    const task = new Task({
      projectId,
      title,
      description,
      assignedUserIds: assignedUserIds || [], // Ensure assignedUserIds is an array, default to empty
      deadline,
      priority,
      createdBy
    });

    await task.save();

    res.status(201).json({
      message: 'Task created successfully',
      task: {
        id: task._id,
        projectId: task.projectId,
        title: task.title,
        status: task.status,
        priority: task.priority,
        deadline: task.deadline,
        assignedUserIds: task.assignedUserIds,
        createdBy: task.createdBy
      }
    });
  } catch (error) {
    console.error('Error creating task:', error);
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Project ID or User ID format' });
    }
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

// @desc Get all tasks for a specific project
// @route GET /api/tasks/project/:projectId
// @access Private (Manager of project OR Member of linked team)
export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    // Find the project and check user access (manager or team member)
    const project = await Project.findById(projectId)
        .populate('teamId', 'memberIds'); // Populate team members for access check

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user is the manager of the project or a member of the linked team
    const isManager = project.managerId.toString() === userId.toString();
    const isMemberOfTeam = isTeamMember(project.teamId, userId);

    if (!isManager && !isMemberOfTeam) {
      return res.status(403).json({ message: 'You do not have access to view tasks for this project' });
    }

    // Find all tasks for this project and populate assigned users
    const tasks = await Task.find({ projectId })
        .populate('assignedUserIds', 'fullName email') // Populate assigned user details
        .populate('createdBy', 'fullName email'); // Populate creator details

    res.status(200).json({
      projectId: projectId,
      tasks: tasks.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        deadline: task.deadline,
        assignedUsers: task.assignedUserIds, // Populated assigned users
        createdBy: task.createdBy, // Populated creator
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error getting tasks by project:', error);
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Project ID format' });
    }
    res.status(500).json({ message: 'Failed to get tasks', error: error.message });
  }
};

// @desc Get a single task by ID
// @route GET /api/tasks/:taskId
// @access Private (Manager of project OR Member of linked team)
export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    // Find the task and populate assigned users
    const task = await Task.findById(taskId)
        .populate('assignedUserIds', 'fullName email') // Populate assigned user details
        .populate('createdBy', 'fullName email'); // Populate creator details


    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Find the associated project to check user access
    const project = await Project.findById(task.projectId)
         .populate('teamId', 'memberIds'); // Populate team members for access check

    if (!project) {
         // This case indicates data inconsistency (task linked to non-existent project)
         console.error(`Data inconsistency: Task ${taskId} linked to non-existent project ${task.projectId}`);
         return res.status(500).json({ message: 'Associated project not found' });
    }

    // Check if the user is the manager of the project or a member of the linked team
    const isManager = project.managerId.toString() === userId.toString();
    const isMemberOfTeam = isTeamMember(project.teamId, userId);

    if (!isManager && !isMemberOfTeam) {
      return res.status(403).json({ message: 'You do not have access to view this task' });
    }

    // Return task details
    res.status(200).json({
      task: {
        id: task._id,
        projectId: task.projectId,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        deadline: task.deadline,
        assignedUsers: task.assignedUserIds, // Populated assigned users
        createdBy: task.createdBy, // Populated creator
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    });
  } catch (error) {
    console.error('Error getting task by ID:', error);
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Task ID format' });
    }
    res.status(500).json({ message: 'Failed to get task', error: error.message });
  }
};

// @desc Update a task (including status, assignment, details)
// @route PUT /api/tasks/:taskId
// @access Private (Manager of project OR Assigned member of task)
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id; // The user making the update request
    const { title, description, status, priority, deadline, assignedUserIds } = req.body;

    // Find the task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Find the associated project to check user access and team members
    const project = await Project.findById(task.projectId)
         .populate('teamId', 'memberIds'); // Populate team members for validation

     if (!project) {
         console.error(`Data inconsistency: Task ${taskId} linked to non-existent project ${task.projectId}`);
         return res.status(500).json({ message: 'Associated project not found' });
    }

    // Determine user's role/relationship to the task/project
    const isManager = project.managerId.toString() === userId.toString();
    const isAssignedMember = isTaskAssigned(task, userId);

    // Check authorization: Must be the project manager OR an assigned member
    if (!isManager && !isAssignedMember) {
        return res.status(403).json({ message: 'You do not have permission to update this task' });
    }

    // --- Update Logic based on Role ---
    if (isManager) {
        // Manager can update any field
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status; // Optional: Add enum validation
        if (priority !== undefined) task.priority = priority; // Optional: Add enum validation
        if (deadline !== undefined) task.deadline = deadline; // Handle null/clearing deadline
        if (assignedUserIds !== undefined) {
             // Validate new assigned users: Must be members of the project's team
            if (assignedUserIds && assignedUserIds.length > 0) {
                 const assignedUsers = await User.find({ _id: { $in: assignedUserIds } });
                 if (assignedUsers.length !== assignedUserIds.length) {
                     return res.status(400).json({ message: 'One or more assigned users not found' });
                 }
                 const team = project.teamId;
                 const nonTeamMembers = assignedUserIds.filter(userId => !isTeamMember(team, userId));
                 if (nonTeamMembers.length > 0) {
                     return res.status(400).json({ message: 'One or more assigned users are not members of the project\'s team' });
                 }
            }
            task.assignedUserIds = assignedUserIds || []; // Update assigned users
        }

    } else if (isAssignedMember) {
        // Assigned members can ONLY update status and description (as per common practice)
        // You can adjust which fields members can update here
        if (status !== undefined) task.status = status; // Allow status update
        if (description !== undefined) task.description = description; // Allow description update

        // Prevent members from changing other fields or assigned users
        if (title !== undefined || priority !== undefined || deadline !== undefined || assignedUserIds !== undefined) {
             // You might choose to just ignore these fields or return a specific error
             // Ignoring is simpler: just don't assign them.
             // If you want to inform the user they can't change these:
             // return res.status(403).json({ message: 'Assigned members can only update status and description' });
             // For now, we just don't update them.
        }
    }
    // ---------------------------------


    await task.save();

    // Refetch the task with populated fields for the response
     const updatedTask = await Task.findById(task._id)
        .populate('assignedUserIds', 'fullName email')
        .populate('createdBy', 'fullName email');


    res.status(200).json({
      message: 'Task updated successfully',
      task: {
        id: updatedTask._id,
        projectId: updatedTask.projectId,
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        priority: updatedTask.priority,
        deadline: updatedTask.deadline,
        assignedUsers: updatedTask.assignedUserIds,
        createdBy: updatedTask.createdBy,
        createdAt: updatedTask.createdAt,
        updatedAt: updatedTask.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating task:', error);
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Task ID or User ID format' });
    }
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
};

// @desc Delete a task
// @route DELETE /api/tasks/:taskId
// @access Private/Manager
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const managerId = req.user._id; // User making the request (must be manager)

    // Find the task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Find the associated project to check if the user is the manager
    const project = await Project.findById(task.projectId);

    if (!project) {
         console.error(`Data inconsistency: Task ${taskId} linked to non-existent project ${task.projectId}`);
         // Decide how to handle this - maybe allow deletion of the orphaned task?
         // For now, we'll treat it as an error or unauthorized if project manager check fails
         // If we allow deleting orphaned tasks, remove the manager check below.
    }

    // Check if the user is the manager of the project
    if (!project || project.managerId.toString() !== managerId.toString()) {
         return res.status(403).json({ message: 'You are not authorized to delete this task' });
    }


    // Delete the task
    await Task.deleteOne({ _id: taskId });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Task ID format' });
    }
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
};
