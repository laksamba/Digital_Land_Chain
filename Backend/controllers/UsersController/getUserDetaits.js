// controllers/AdminController/getAllUsers.js
import User from "../../models/User.js";

export const getUserDetails = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.status(200).json({ users }); // ✅ MUST be an array
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users", message: err.message });
  }
};
