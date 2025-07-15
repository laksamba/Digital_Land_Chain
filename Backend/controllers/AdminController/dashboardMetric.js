// controllers/AdminController/dashboardMetrics.js
import asyncHandler from "express-async-handler";
import Land from "../../models/Land.js";
import User from "../../models/User.js";
import Transaction from "../../models/Transfer.js"; // Optional: if you're tracking transactions

export const getDashboardMetrics = asyncHandler(async (req, res) => {
  // Time window for 1 month (last 30 days)
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

  // Lands
  const totalLands = await Land.countDocuments();
  const verifiedLands = await Land.countDocuments({ status: "verified" });

  // 👥 Users
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({
    updatedAt: { $gte: oneMonthAgo },
  });

  //  Transactions
  const pendingTransactions = await Transaction.countDocuments({ status: "pending" });

   // Count users with pending KYC
  const pendingKyc = await User.countDocuments({ "kyc.verificationStatus": "Pending" });


  // Count lands with pending registration
  const pendingLandRegistry = await Land.countDocuments({ status: "pending" });

  // Count land transfer transactions with pending status
  const pendingLandTransfer = await Transaction.countDocuments({ status: "pending" });

  //  User Roles
  const totalCitizens = await User.countDocuments({ role: "citizen" });
  const totalSurveyOfficers = await User.countDocuments({ role: "survey_officer" });
  const totalLandOfficers = await User.countDocuments({ role: "land_officer" });
  const totalBanks = await User.countDocuments({ role: "bank" });

  res.status(200).json({
    totalLands,
    verifiedLands,
    totalUsers,
    activeUsersLastMonth: activeUsers,
    pendingTransactions,
     pendingKyc,
    pendingLandRegistry,
    pendingLandTransfer,
    userRoles: {
      totalCitizens,
      totalSurveyOfficers,
      totalLandOfficers,
      totalBanks,
    },
  });
});
