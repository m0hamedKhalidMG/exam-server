const User = require('../model/User'); // Adjust path as necessary
const multer = require('multer');
const bucket = require('../firebase'); // Import the Firebase storage bucket
const { v4: uuidv4 } = require('uuid');
const DashboardImage = require('../model/DashboardImages');

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
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    // Remove the password field from each user object
    const sanitizedUsers = users.map((user) => {
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    });

    // Send sanitized users as the response
    res.status(200).json(sanitizedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
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
  exports.getUser = async (req, res) => {
    const  userId  = req.user.id; // The user to be suspended
    try {
      // Find the user by ID
      const user = await User.findById(userId);
      return res.json({ user: user });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  exports.updateUser=async (req, res) => {
    const userId = req.params.id;
    const { name, age, country, province, whatsappNumber } = req.body;
  
    try {
      // Validate if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update the user data
      user.name = name || user.name;
      user.age = age || user.age;
      user.country = country || user.country;
      user.province = province || user.province;
      user.whatsappNumber = whatsappNumber || user.whatsappNumber;
    //  user.profilePic = profilePic || user.profilePic;
  
      // Save the updated user
      const updatedUser = await user.save();
  
      res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }}
  
exports.updateimage=async (req, res) => {
  try {
    const { userId } = req.params;
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file;
    const fileName = `profileImages/${userId}-${uuidv4()}`;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
        metadata: {
            contentType: file.mimetype
        },
        public: true,
    });

    blobStream.on('error', (error) => {
        console.error(error);
        return res.status(500).json({ message: 'Upload failed', error });
    });

    blobStream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        // Update user profileImage field in MongoDB
        await User.findByIdAndUpdate(userId, { profileImage: publicUrl }, { new: true });

        return res.status(200).json({ message: 'Image uploaded successfully', imageUrl: publicUrl });
    });

    blobStream.end(file.buffer);
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
}
}

exports.updateImageDB = async (req, res) => {
  try {
    console.log(req.body)
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { type } = req.body; // "adminBg" or "userBg"
    if (!type || (type !== 'adminBg' && type !== 'userBg')) {
      return res.status(400).json({ error: 'Invalid type specified' });
    }

    const file = req.file;

    const fileName = `dashboardImages/${type}-${uuidv4()}`;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      public: true,
    });

    blobStream.on('error', (error) => {
      console.error(error);
      return res.status(500).json({ message: 'Upload failed', error });
    });

    blobStream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      // Update the corresponding background in the database
      const updateField = type === 'adminBg' ? { adminBg: publicUrl } : { userBg: publicUrl };

      await DashboardImage.findOneAndUpdate({}, updateField, { upsert: true, new: true });

      return res.status(200).json({ message: `${type} uploaded successfully`, imageUrl: publicUrl });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};
exports.getImageDB = async (req, res) => {
  try {
      const images = await DashboardImage.findOne(); // Assuming only one set of images exists
      if (!images) {
          return res.status(404).json({ message: "No dashboard images found" });
      }
      res.json(images);
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
}
