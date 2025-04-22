import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from 'http'; 
import { Server as SocketIOServer } from 'socket.io';
import authRouter from './routes/authRouter.js';
import teamRouter from './routes/teamRouter.js';
import userRouter from './routes/userRouter.js';
import projectRouter from './routes/projectRouter.js';
import taskRouter from "./routes/taskRouter.js";
import setupSocketIO from './socket.js';


dotenv.config();



const app = express();

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { 
    origin: process.env.FRONTEND_URL || "http://localhost:5173", 
    methods: ["GET", "POST"] 
  }
});

// DB connection
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB connection successful!");
    } catch (err) {
      console.error("MongoDB connection failed: ", err.message);
      process.exit(1);
    }
};

connectDB();

app.use(express.json());
app.use(cors());

//testing route
app.get("/",(req,res)=>{
    return res.json("Hello");
});


app.use('/api/auth', authRouter);
app.use('/api/teams', teamRouter);
app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);

setupSocketIO();

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`Server is listening at http://localhost:5000`);
})

export {io};