import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/Auth.js';
import { errorHandler } from './middleware/MiddleWare.js';
import dotenv from 'dotenv';
dotenv.config();




const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth',authRoutes);
app.use(errorHandler);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});