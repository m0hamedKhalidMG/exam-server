const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();

const { authenticateToken, isAuthenticated, isAdmin,checkIfSuspended } = require('../Middleware/CheckPassport');
const { suspendUser,ActiveUser,getUser,updateUser ,getAllUsers,updateimage,getimg,updateImageDB,getImageDB} = require('../controllers/UserController'); // Adjust path
const router = express.Router();

router.post('/suspend/:userId', authenticateToken, isAdmin, suspendUser);
router.post('/unsuspend/:userId', authenticateToken, isAdmin, ActiveUser);


const upload = multer({ storage });

router.get('/students', authenticateToken, isAdmin,getAllUsers)
router.get('/profile', authenticateToken, isAuthenticated,checkIfSuspended,getUser)
router.put('/user_update/:id', authenticateToken, isAuthenticated,checkIfSuspended,updateUser)
router.put('/update-profile-image/:userId',authenticateToken, isAuthenticated,checkIfSuspended,upload.single('image'),updateimage);
router.post('/dashboard/images',authenticateToken,isAdmin,upload.single('image'),updateImageDB);
router.get('/getimages',getImageDB)

module.exports = router;
