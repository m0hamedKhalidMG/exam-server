const express = require('express');
const { authenticateToken, isAuthenticated, isAdmin,checkIfSuspended } = require('../Middleware/CheckPassport');
const { suspendUser,ActiveUser,getUser,updateUser ,getAllUsers} = require('../controllers/UserController'); // Adjust path
const router = express.Router();

router.post('/suspend/:userId', authenticateToken, isAdmin, suspendUser);
router.post('/unsuspend/:userId', authenticateToken, isAdmin, ActiveUser);



router.get('/students', authenticateToken, isAdmin,getAllUsers)
 
  router.get('/profile', authenticateToken, isAuthenticated,checkIfSuspended,getUser)
  router.put('/user_update/:id', authenticateToken, isAuthenticated,checkIfSuspended,updateUser)

//   // Admin-only route
//   router.get('/admin', authenticateToken, isAdmin, (req, res) => {
//     res.send('Welcome, Admin!');
//   });

module.exports = router;
