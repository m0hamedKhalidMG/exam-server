const express = require('express');
const { authenticateToken, isAuthenticated, isAdmin,checkIfSuspended } = require('../Middleware/CheckPassport');

const examController = require('../controllers/examController');
const StudentExamController = require('../controllers/StudentExamController');

const router = express.Router();




// Exam Routes
router.post('/create', authenticateToken, isAdmin, examController.createExam);
router.get('/', authenticateToken, examController.getAllExams);
router.get('/:id', authenticateToken, examController.getExamById);


router.post('/start', authenticateToken, StudentExamController.startExam);
// router.post('/submit', authenticateToken, StudentExamController.submitExam);
router.post('/:studentExamId/submit', authenticateToken, isAuthenticated, StudentExamController.submitExam);
router.get('/history', authenticateToken, isAuthenticated, StudentExamController.getExamHistory);

module.exports = router;
