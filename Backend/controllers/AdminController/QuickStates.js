// controllers/AdminController/quickStats.js
import asyncHandler from "express-async-handler";
import User from "../../models/User.js";
import Land from "../../models/Land.js";

export const getQuickStats = asyncHandler(async (req, res) => {
  const newUsersToday = await User.countDocuments({
    createdAt: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
    },
  });

  const pendingLands = await Land.countDocuments({ status: "pending" });

  res.json({
    newUsersToday,
    pendingLands,
  });
});
