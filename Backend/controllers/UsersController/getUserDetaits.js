import User from '../../models/User.js'; // adjust the path to your User model

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user?.userId; // assuming userId is set by JWT middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: No user ID provided' });
    }

    const user = await User.findById(userId).select('-password'); // exclude password field

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};
