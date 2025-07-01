// controllers/AdminController/systemHealth.js
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const getSystemHealth = asyncHandler(async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  res.json({
    serverTime: new Date(),
    database: {
      status: dbStatus,
      host: mongoose.connection.host,
    },
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
  });
});
