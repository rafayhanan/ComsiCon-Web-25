import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from './routes/authRouter.js';
import teamRouter from './routes/teamRouter.js';
import userRouter from './routes/userRouter.js';
import projectRouter from './routes/projectRouter.js';
import taskRouter from "./routes/taskRouter.js";

dotenv.config();



const app = express();

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`Server is listening at http://localhost:5000`);
})