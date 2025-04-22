import { io } from './server.js';
import Message from './models/Message.js';
import Project from './models/Project.js';
import User from './models/User.js';
import { verifyToken } from './utils/authUtils.js';
import mongoose from 'mongoose';

// Helper function to check if a user is a member of a team
const isTeamMember = (team, userId) => {
    if (!team || !team.memberIds) return false;
    return team.memberIds.some(memberId => memberId.toString() === userId.toString());
};

// Helper function to get project details with populated team members for access check
const getProjectWithTeamMembers = async (projectId) => {
     if (!mongoose.Types.ObjectId.isValid(projectId)) {
         return null;
     }
     const project = await Project.findById(projectId)
         .populate('teamId', 'memberIds');

     return project;
};


const setupSocketIO = () => {
  io.on('connection', async (socket) => {
    console.log('a user connected:', socket.id);

    // Authentication for WebSocket Connection
    const token = socket.handshake.query.token;
    if (!token) {
      console.log('Socket connection rejected for %s: No token provided', socket.id);
      socket.disconnect(true);
      return;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      console.log('Socket connection rejected for %s: Invalid or expired token', socket.id);
      socket.disconnect(true);
      return;
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      console.log('Socket connection rejected for %s: User not found', socket.id);
      socket.disconnect(true);
      return;
    }

    socket.user = user;
    console.log(`User ${user.fullName} (${user._id}) authenticated and connected via socket ${socket.id}`);


    // Event: Join Project Channel
    socket.on('joinProjectChannel', async (projectId) => {
      if (!socket.user) {
          socket.emit('channelError', 'Authentication required');
          return;
      }
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
           socket.emit('channelError', 'Invalid Project ID format');
           return;
      }

      try {
        const project = await getProjectWithTeamMembers(projectId);

        if (!project) {
            socket.emit('channelError', 'Project not found');
            return;
        }

        const isManager = project.managerId.toString() === socket.user._id.toString();
        const isMemberOfTeam = isTeamMember(project.teamId, socket.user._id);

        if (!isManager && !isMemberOfTeam) {
            socket.emit('channelError', 'You do not have access to this project channel');
            return;
        }

        const roomName = `project_${projectId}`;
        socket.join(roomName);
        console.log(`${socket.user.fullName} joined room ${roomName} for project ${project.name}`);

        // Send Message History
        const messageHistory = await Message.find({ projectId })
            .populate('senderId', 'fullName')
            .sort({ createdAt: 1 })
            .limit(50);

        socket.emit('messageHistory', messageHistory);

      } catch (error) {
        console.error(`Error user ${socket.user?.fullName} joining project channel ${projectId}:`, error);
        socket.emit('channelError', 'Failed to join channel');
      }
    });


    // Event: sendMessage
    socket.on('sendMessage', async ({ projectId, content }) => { // Removed 'file' from payload
      if (!socket.user) {
          socket.emit('messageError', 'Authentication required');
          return;
      }
       if (!mongoose.Types.ObjectId.isValid(projectId)) {
           socket.emit('messageError', 'Invalid Project ID format');
           return;
      }
      if (!content || !content.trim()) { // Content is now required and must not be empty
           socket.emit('messageError', 'Message content is required');
           return;
      }

      const roomName = `project_${projectId}`;

      // Access Check before Sending
      try {
           const project = await getProjectWithTeamMembers(projectId);
           const isManager = project && project.managerId.toString() === socket.user._id.toString();
           const isMemberOfTeam = project && isTeamMember(project.teamId, socket.user._id);

           if (!project || (!isManager && !isMemberOfTeam)) {
               socket.emit('messageError', 'You do not have access to send messages in this project channel');
               socket.leave(roomName); // Make the user leave if they shouldn't be here
               return;
           }

           // Save the Message to Database
           const newMessage = new Message({
               projectId,
               senderId: socket.user._id,
               content: content.trim() // Save trimmed content
           });

           await newMessage.save();

           // Prepare Message for Broadcasting
           const populatedMessage = await Message.findById(newMessage._id)
               .populate('senderId', 'fullName');

           // Broadcast the Message
           io.to(roomName).emit('receiveMessage', populatedMessage);
           console.log(`Message sent to room ${roomName} by ${socket.user.fullName}`);

      } catch (error) {
           console.error(`Error user ${socket.user?.fullName} sending message to project ${projectId}:`, error);
           socket.emit('messageError', 'Failed to send message');
      }
    });


    // Event: leaveProjectChannel (Optional but good practice)
    socket.on('leaveProjectChannel', (projectId) => {
        if (!socket.user || !mongoose.Types.ObjectId.isValid(projectId)) return;
        const roomName = `project_${projectId}`;
        socket.leave(roomName);
        console.log(`${socket.user.fullName} left room ${roomName}`);
    });


    // Event: disconnect
    socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id);
    });

    // Optional: Typing Indicator Events
    socket.on('typing', (projectId) => {
        if (!socket.user || !mongoose.Types.ObjectId.isValid(projectId)) return;
        const roomName = `project_${projectId}`;
        socket.to(roomName).emit('userTyping', { userId: socket.user._id, fullName: socket.user.fullName, projectId });
    });

    socket.on('stopTyping', (projectId) => {
         if (!socket.user || !mongoose.Types.ObjectId.isValid(projectId)) return;
         const roomName = `project_${projectId}`;
         socket.to(roomName).emit('userStopTyping', { userId: socket.user._id, projectId });
    });

  });
};

export default setupSocketIO;
