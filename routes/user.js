const express = require('express');
const { authenticateToken, isAuthenticated, isAdmin,checkIfSuspended } = require('../Middleware/CheckPassport');
const { suspendUser,ActiveUser } = require('../controllers/UserController'); // Adjust path
const router = express.Router();

router.put('/suspend/:userId', authenticateToken, isAdmin, suspendUser);
router.put('/unsuspend/:userId', authenticateToken, isAdmin, ActiveUser);



router.get('/protected', authenticateToken, isAuthenticated,checkIfSuspended, (req, res) => {
    res.send('This is a protected route.');
  });
  
//   // Admin-only route
//   router.get('/admin', authenticateToken, isAdmin, (req, res) => {
//     res.send('Welcome, Admin!');
//   });

module.exports = router;
