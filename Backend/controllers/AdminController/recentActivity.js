// controllers/AdminController/recentActivity.js
import asyncHandler from "express-async-handler";
import User from "../../models/User.js";
import Land from "../../models/Land.js";

export const getRecentActivity = asyncHandler(async (req, res) => {
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
  const recentLands = await Land.find().sort({ createdAt: -1 }).limit(5);

  res.json({
    recentUsers,
    recentLands,
  });
});
