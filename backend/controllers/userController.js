import User from '../models/User.js';
import Team from '../models/Team.js';
import {
  generateRandomPassword,
  hashPassword
} from '../utils/authUtils.js';
import { sendInviteEmail } from '../utils/emailUtils.js';

// Add team member
export const addTeamMember = async (req, res) => {
  try {
    // Updated: Expect fullName instead of firstName and lastName
    const { email, fullName, teamId } = req.body;
    const managerId = req.user._id;

    // Check if team exists and manager is authorized
    const team = await Team.findOne({ _id: teamId, managerId });

    if (!team) {
      return res.status(404).json({ message: 'Team not found or you are not authorized' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Generate random password and hash it
      const plainPassword = generateRandomPassword();
      const hashedPassword = await hashPassword(plainPassword);

      // Create new user
      user = new User({
        email,
        password: hashedPassword,
        // Updated: Use fullName
        fullName,
        role: 'team_member',
        teamIds: [teamId],
        createdBy: managerId
      });

      await user.save();

      // Add user to team
      team.memberIds.push(user._id);
      await team.save();

      // Send invite email with credentials
      // Pass fullName to email utility if needed for personalization
      await sendInviteEmail(email, plainPassword, team.name, fullName);

      res.status(201).json({
        message: 'Team member added and invitation sent',
        user: {
          id: user._id,
          email: user.email,
          // Updated: Use fullName
          fullName: user.fullName
        }
      });
    } else {
      // User exists, check if already a member of the team
      if (team.memberIds.includes(user._id)) {
        return res.status(400).json({ message: 'User is already a member of this team' });
      }

      // Add user to team
      team.memberIds.push(user._id);
      await team.save();

      // Update user's team list
      if (!user.teamIds.includes(teamId)) {
        user.teamIds.push(teamId);
        await user.save();
      }

      res.status(200).json({
        message: 'Existing user added to team',
        user: {
          id: user._id,
          email: user.email,
          // Updated: Use fullName
          fullName: user.fullName
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to add team member', error: error.message });
  }
};

// Get all team members for a team
export const getTeamMembers = async (req, res) => {
  try {
    const { teamId } = req.params;
    const managerId = req.user._id;

    const team = await Team.findOne({ _id: teamId, managerId })
      // Updated: Populate fullName instead of firstName and lastName
      .populate('memberIds', 'fullName email');

    if (!team) {
      return res.status(404).json({ message: 'Team not found or you are not authorized' });
    }

    res.status(200).json({
      team: {
        id: team._id,
        name: team.name
      },
      members: team.memberIds.map(member => ({
        id: member._id,
        // Updated: Use fullName
        fullName: member.fullName,
        email: member.email
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get team members', error: error.message });
  }
};

// Remove team member - No changes needed here
export const removeTeamMember = async (req, res) => {
  try {
    const { teamId, userId } = req.params;
    const managerId = req.user._id;

    const team = await Team.findOne({ _id: teamId, managerId });

    if (!team) {
      return res.status(404).json({ message: 'Team not found or you are not authorized' });
    }

    // Remove user from team
    team.memberIds = team.memberIds.filter(id => id.toString() !== userId);
    await team.save();

    // Remove team from user's teams
    await User.updateOne(
      { _id: userId },
      { $pull: { teamIds: teamId } }
    );

    res.status(200).json({ message: 'Team member removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove team member', error: error.message });
  }
};
