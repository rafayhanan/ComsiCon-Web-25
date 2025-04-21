import Team from '../models/Team.js';
import User from '../models/User.js';

// Create a new team - No changes needed here
export const createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    const managerId = req.user._id;

    // Create new team
    const team = new Team({
      name,
      description,
      managerId,
      memberIds: []
    });

    await team.save();

    res.status(201).json({
      message: 'Team created successfully',
      team: {
        id: team._id,
        name: team.name,
        description: team.description
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create team', error: error.message });
  }
};

// Get all teams managed by current user - No changes needed here
export const getManagedTeams = async (req, res) => {
  try {
    const managerId = req.user._id;

    const teams = await Team.find({ managerId });

    res.status(200).json({
      teams: teams.map(team => ({
        id: team._id,
        name: team.name,
        description: team.description,
        memberCount: team.memberIds.length,
        createdAt: team.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get teams', error: error.message });
  }
};

// Get a single team by ID
export const getTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user._id;

    const team = await Team.findById(teamId)
      // Updated: Populate fullName instead of firstName and lastName
      .populate('managerId', 'fullName email')
      .populate('memberIds', 'fullName email');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if user is manager or member of the team
    // Ensure managerId is populated before checking _id
    const isManager = team.managerId && team.managerId._id.toString() === userId.toString();
    const isMember = team.memberIds.some(member => member && member._id.toString() === userId.toString());


    if (!isManager && !isMember) {
      return res.status(403).json({ message: 'You do not have access to this team' });
    }

    res.status(200).json({
      team: {
        id: team._id,
        name: team.name,
        description: team.description,
        manager: team.managerId ? { // Check if managerId is populated
          id: team.managerId._id,
          // Updated: Use fullName
          fullName: team.managerId.fullName,
          email: team.managerId.email
        } : null, // Handle case where manager might not be populated (though it should be here)
        members: team.memberIds.map(member => member ? { // Check if member is populated
          id: member._id,
          // Updated: Use fullName
          fullName: member.fullName,
          email: member.email
        } : null).filter(member => member !== null), // Filter out any null members if population failed
        createdAt: team.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get team', error: error.message });
  }
};

// Update team - No changes needed here
export const updateTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { name, description } = req.body;
    const managerId = req.user._id;

    const team = await Team.findOne({ _id: teamId, managerId });

    if (!team) {
      return res.status(404).json({ message: 'Team not found or you are not authorized' });
    }

    // Update team
    if (name) team.name = name;
    if (description) team.description = description;

    await team.save();

    res.status(200).json({
      message: 'Team updated successfully',
      team: {
        id: team._id,
        name: team.name,
        description: team.description
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update team', error: error.message });
  }
};

// Delete team - No changes needed here
export const deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const managerId = req.user._id;

    const team = await Team.findOne({ _id: teamId, managerId });

    if (!team) {
      return res.status(404).json({ message: 'Team not found or you are not authorized' });
    }

    await Team.deleteOne({ _id: teamId });

    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete team', error: error.message });
  }
};
