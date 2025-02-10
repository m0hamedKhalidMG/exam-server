const jwt = require('jsonwebtoken');
const User = require('../model/User'); 
const { v4: uuidv4 } = require('uuid');
const bucket = require('../firebase'); // Import the Firebase storage bucket

// Utility function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, user: user.role,stateuser:user.suspended }, // Payload
    process.env.JWT_SECRET,           // Secret key
    { expiresIn: process.env.JWT_EXPIRES_IN } // Token expiration
  );
};

// Register User

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, name, age, country, province, whatsappNumber } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // File upload setup
    const file = req.file;
    const fileName = `profileImages/${uuidv4()}`;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: { contentType: file.mimetype },
      public: true,
    });

    blobStream.on('error', (error) => {
      console.error(error);
      return res.status(500).json({ message: 'Upload failed', error });
    });

    blobStream.on('finish', async () => {
      try {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        
        // Create new user
        const newUser = await User.create({
          username,
          email,
          password,
          name,
          age,
          country,
          province,
          whatsappNumber,
          profileImage: publicUrl,
        });

        if (!newUser) {
          return res.status(400).json({ message: 'Invalid user data' });
        }

        const token = generateToken(newUser);

        res.status(201).json({
          message: 'User registered successfully',
          user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            age: newUser.age,
            country: newUser.country,
            province: newUser.province,
            whatsappNumber: newUser.whatsappNumber,
            profileImage: newUser.profileImage,
          },
          token,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'User creation failed', error: error.message });
        console.log(error)
      }
    });

    blobStream.end(file.buffer); // Ensure the upload process starts
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};









// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      message: 'User logged in successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        age:user.age,
        country:user.country,
        province:user.province,
        whatsappNumber:user.whatsappNumber,
        profileImage:user.profileImage
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

