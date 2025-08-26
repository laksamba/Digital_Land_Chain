import express from 'express';
import cors from 'cors'; // 
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import landRoutes from './routes/landRoutes.js';
import { errorHandler } from './middleware/MiddleWare.js';
import adminRoutes from './routes/adminRoutes.js';
import transferRoutes from './routes/transferRoutes.js';
import surveyRoutes from './routes/surveyRoutes.js';
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

app.use((req, res, next) => {
  console.log('Body:', req.body);
  next();
});


// Routes
app.use('/api', authRoutes);
app.use('/api',landRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/transfer", transferRoutes);
app.use("/api/survey", surveyRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
