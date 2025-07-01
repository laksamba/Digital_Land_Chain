import asyncHandler from "express-async-handler";
import User from "../../models/User.js";


// ✅ Get specific user by ID
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// ✅ Update user details
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, kycStatus } = req.body;
  const user = await User.findById(req.params.userId);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  if (kycStatus) user.kyc.verificationStatus = kycStatus;

  await user.save();
  res.json({ message: "User updated", user });
});

// ✅ Assign/Edit user role only
// export const assignUserRole = asyncHandler(async (req, res) => {
//   const { role } = req.body;
//   const user = await User.findById(req.params.userId);
//   if (!user) return res.status(404).json({ message: "User not found" });

//   user.role = role;
//   await user.save();

//   res.json({ message: `Role updated to ${role}`, user });
// });

// ✅ Delete user
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
});
