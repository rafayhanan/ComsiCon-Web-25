import Project from '../models/Project.js';
import Team from '../models/Team.js'; 
import User from '../models/User.js'; 

// Helper function to check if a user is a member of a team
const isTeamMember = (team, userId) => {
    if (!team || !team.memberIds) return false;
    return team.memberIds.some(memberId => memberId.toString() === userId.toString());
};


export const createProject = async (req, res) => {
  try {
    const { name, description, teamId } = req.body;
    const managerId = req.user._id; // Manager ID from authenticated user

    // Validate teamId: Check if the team exists and the requesting user is its manager
    const team = await Team.findOne({ _id: teamId, managerId });

    if (!team) {
      return res.status(404).json({ message: 'Team not found or you are not authorized to assign this team' });
    }

    // Check if a project with this name already exists for this manager (optional, but good)
    const existingProject = await Project.findOne({ name, managerId });
    if (existingProject) {
        return res.status(400).json({ message: `Project with name '${name}' already exists for this manager.` });
    }


    // Create the new project
    const project = new Project({
      name,
      description,
      managerId,
      teamId // Link the project to the specified team
    });

    await project.save();

    res.status(201).json({
      message: 'Project created successfully',
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
        teamId: project.teamId,
        managerId: project.managerId,
        status: project.status
      }
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
};


export const getManagedProjects = async (req, res) => {
  try {
    const managerId = req.user._id;

    // Find projects managed by the user and populate the linked team's name
    const projects = await Project.find({ managerId })
        .populate('teamId', 'name description'); // Populate team name and description

    res.status(200).json({
      projects: projects.map(project => ({
        id: project._id,
        name: project.name,
        description: project.description,
        status: project.status,
        managerId: project.managerId, // Manager ID
        team: project.teamId ? { // Include team details if populated
            id: project.teamId._id,
            name: project.teamId.name,
            description: project.teamId.description
        } : null,
        createdAt: project.createdAt
      }))
    });
  } catch (error) {
    console.error('Error getting managed projects:', error);
    res.status(500).json({ message: 'Failed to get managed projects', error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    // Find the project and populate manager, team, and team members
    const project = await Project.findById(projectId)
      .populate('managerId', 'fullName email') // Populate manager details
      .populate({ // Populate the team and its members
          path: 'teamId',
          select: 'name description memberIds', // Select fields from Team
          populate: { // Populate members within the Team
              path: 'memberIds',
              select: 'fullName email' // Select fields from User members
          }
      });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user is the manager of the project or a member of the linked team
    const isManager = project.managerId._id.toString() === userId.toString();
    const isMemberOfTeam = isTeamMember(project.teamId, userId);

    if (!isManager && !isMemberOfTeam) {
      return res.status(403).json({ message: 'You do not have access to this project' });
    }

    // Return project details including populated manager, team, and members
    res.status(200).json({
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
        status: project.status,
        manager: project.managerId, // Populated manager object
        team: project.teamId ? { // Populated team object with members
            id: project.teamId._id,
            name: project.teamId.name,
            description: project.teamId.description,
            members: project.teamId.memberIds // Populated array of member objects
        } : null,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }
    });
  } catch (error) {
    console.error('Error getting project by ID:', error);
     // Check for invalid ObjectId format
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Project ID format' });
    }
    res.status(500).json({ message: 'Failed to get project', error: error.message });
  }
};


export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, teamId, status } = req.body; // Allow updating teamId and status
    const managerId = req.user._id;

    // Find the project and ensure the requesting user is the manager
    const project = await Project.findOne({ _id: projectId, managerId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or you are not authorized to update it' });
    }

    
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (status !== undefined) {
        
        project.status = status;
    }
    if (teamId !== undefined && teamId.toString() !== project.teamId.toString()) {
        
        const newTeam = await Team.findOne({ _id: teamId, managerId });
        if (!newTeam) {
            return res.status(400).json({ message: 'New team not found or you are not authorized to assign it' });
        }
        project.teamId = teamId;
        
    }


    await project.save();

    res.status(200).json({
      message: 'Project updated successfully',
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
        status: project.status,
        teamId: project.teamId
      }
    });
  } catch (error) {
    console.error('Error updating project:', error);
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Project ID format' });
    }
    res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const managerId = req.user._id;

    
    const project = await Project.findOne({ _id: projectId, managerId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or you are not authorized to delete it' });
    }

    
    await Task.deleteMany({ projectId: projectId });
    
    await Project.deleteOne({ _id: projectId });

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
     if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid Project ID format' });
    }
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
};
