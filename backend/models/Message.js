import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  projectId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  senderId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: { 
    type: String,
    required: true, 
    trim: true
  }
}, { timestamps: true }); 

const Message = mongoose.model('Message', MessageSchema);

export default Message;
