
const Exam = require('../model/Exam'); // Assuming Exam schema is in models folder
const User = require('../model/User'); // Assuming User schema exists

exports.getExamRemainingTime = async (req, res) => {
    try {
      const { examId } = req.params;
      const exam = await Exam.findById(examId);
      if (!exam) return res.status(404).json({ message: 'Exam not found' });
  
      const remainingTime = exam.getRemainingTime();
      res.status(200).json({
        examId: exam._id,
        remainingTime, // Remaining time in milliseconds
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  

// Create an Exam
exports.createExam = async (req, res) => {
    try {


      const { title, description, ageRange, class: examClass, questions, timer, startDateTime } = req.body;
      const createdBy = req.user.id; // Assuming user data is attached to the request
      const newExam = new Exam({
        title,
        description,
        ageRange,
        class: examClass,
        questions,
        timer,
        startDateTime,
        createdBy,
      });
  
      await newExam.save();
      res.status(201).json({ message: 'Exam created successfully', exam: newExam });
    } catch (error) {
      res.status(500).json({ message: 'Error creating exam', error: error.message });
    }
  };
  

// Get all Exams
exports.getAllExams = async (req, res) => {
    try {
      const exams = await Exam.find().populate('createdBy', 'username email');
      res.status(200).json(exams);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching exams', error: error.message });
    }
  };
  

// Get a Single Exam by ID
exports.getExamById = async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.id).populate('createdBy', 'username email');
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }
      res.status(200).json(exam);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching exam', error: error.message });
    }
  };
  

// Check User's Answers
exports.checkAnswers = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body; // Format: { questionId: "userAnswer" }

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    let score = 0;
    const totalQuestions = exam.questions.length;

    // Compare user's answers with correct answers
    exam.questions.forEach((question) => {
      const userAnswer = answers[question._id];
      if (userAnswer && userAnswer.trim() === question.correctAnswer.trim()) {
        score++;
      }
    });

    res.status(200).json({
      message: 'Exam evaluated successfully',
      score,
      totalQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error evaluating exam', error: error.message });
  }
};

// Delete an Exam
exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findByIdAndDelete(id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exam', error: error.message });
  }
};
