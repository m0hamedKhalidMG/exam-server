const express = require('express');
const { body } = require('express-validator');
const {registerUser,loginUser}=require('../controllers/authController')
const multer = require('multer');
const storage = multer.memoryStorage();
const router = express.Router();
const upload = multer({ storage });

// Register Route
router.post(
  '/register',upload.single('image'),
  [
    body('username').not().isEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match'),
  ],
  registerUser
);

// Login Route
router.post('/login', loginUser);

module.exports = router;
