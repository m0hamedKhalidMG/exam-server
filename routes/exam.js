const express = require('express');
const { authenticateToken, isAuthenticated, isAdmin,checkIfSuspended } = require('../Middleware/CheckPassport');

const examController = require('../controllers/examController');
const StudentExamController = require('../controllers/StudentExamController');

const router = express.Router();


router.get('/Examsforstudent',authenticateToken, isAuthenticated,checkIfSuspended, StudentExamController.getAllExamsforstudent);
router.get('/getbest', authenticateToken, examController.getscores);

router.put('/update/:examId', authenticateToken, isAdmin, examController.updateExam);
router.delete('/delete/:id', authenticateToken, isAdmin, examController.deleteExam);
router.delete('/:examId/question/:questionIdx',authenticateToken, isAdmin,examController.deleteExamQestion);
 
// Exam Routes
router.post('/create', authenticateToken, isAdmin, examController.createExam);
router.get('/', authenticateToken, examController.getAllExams);
router.get('/:id', authenticateToken, examController.getExamById);


router.post('/start', authenticateToken, StudentExamController.startExam);


// router.post('/submit', authenticateToken, StudentExamController.submitExam);
router.post('/submit', authenticateToken, isAuthenticated, StudentExamController.submitExam);
router.get('/history', authenticateToken, isAuthenticated, StudentExamController.getExamHistory);

module.exports = router;
