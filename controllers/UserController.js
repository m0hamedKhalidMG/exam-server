const User = require('../model/User'); // Adjust path as necessary

exports.suspendUser = async (req, res) => {
  const { userId } = req.params; // The user to be suspended
  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Suspend the user
    user.suspended = true;
    await user.save();

    res.status(200).json({ message: 'User account suspended successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.ActiveUser = async (req, res) => {
    const { userId } = req.params; // The user to be suspended
    try {
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Suspend the user
      user.suspended = false;
      await user.save();
  
      res.status(200).json({ message: 'User account Active successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  