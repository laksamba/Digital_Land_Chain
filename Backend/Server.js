import express from 'express';
import cors from 'cors'; // 
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/Auth.js';
import { errorHandler } from './middleware/MiddleWare.js';

dotenv.config();

const app = express();

// ✅ CORS Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', 
  credentials: true 
}));

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', authRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
