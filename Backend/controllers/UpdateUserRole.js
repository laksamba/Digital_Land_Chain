import User from "../models/User";

export const updateUserRole = async (req, res, next) => {
  try {
    const { userId, newRole } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Only admins can assign roles.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = newRole;
    await user.save();

    res.status(200).json({ message: `User role updated to ${newRole}` });
  } catch (error) {
    next(error);
  }
};
