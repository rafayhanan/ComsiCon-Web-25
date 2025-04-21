import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true
  },
  managerId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teamId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true 
  },

  status: { 
    type: String,
    enum: ['Planning', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Planning'
  }
}, { timestamps: true }); 

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
