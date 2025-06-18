import express from 'express';
import connectDB from './config/db.js';



const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});