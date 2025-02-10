
const Exam = require('../model/Exam'); // Assuming Exam schema is in models folder
const User = require('../model/User'); // Assuming User schema exists
const StudentExam = require('../model/StudentExam');

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
  
  exports.updateExam = async (req, res) => {
    try {
      const { examId } = req.params; 
      const {
        title,
        description,
        ageGroup,
        questions,
        duration,
        startDateTime,
        endDateTime,
      } = req.body;
  const level=req.body.class
      // Validate that the exam exists
      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }
  
     
  
      // Validate that endDateTime is after startDateTime
      if (endDateTime <= startDateTime) {
        return res.status(400).json({ message: 'End time must be after start time' });
      }
  
      // Update exam fields
      exam.title = title || exam.title;
      exam.description = description || exam.description;
      exam.ageGroup = ageGroup || exam.ageGroup;
      exam.class = level || exam.class;
      exam.questions = questions || exam.questions;
      exam.timer = duration || exam.timer;
      exam.startDateTime = startDateTime || exam.startDateTime;
      exam.endDateTime = endDateTime || exam.endDateTime;
  
      // Save the updated exam
      await exam.save();
  
      res.status(200).json({ message: 'Exam updated successfully', exam });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Error updating exam', error: error.message });
    }
  };
   

// Create an Exam
exports.createExam = async (req, res) => {
  try {
    const {
      title,
      description,
      ageGroup,
      level,
      questions,
      duration,
      startDate,
      startTime,
      endDate,
      selectExamCategory,
      endTime,
    } = req.body;
    console.log(req.body)

    const startDateTimec = `${startDate}T${startTime}:00`; // 'YYYY-MM-DDTHH:MM:SS'
    const endDateTimec = `${endDate}T${endTime}:00`;
    // Create a Date object from the combined string
    const startDateTimel = new Date(startDateTimec);
    const endDateTimel = new Date(endDateTimec);

    // Define the options for formatting
    const options = {
      timeZone: "Europe/Bucharest",
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    
    const startDateTime = new Intl.DateTimeFormat("en-US", options).format(startDateTimel);
    const endDateTime = new Intl.DateTimeFormat("en-US", options).format(endDateTimel);
    const dateObj1 = new Date(startDateTime);
    const dateObj2 = new Date(endDateTime);

    // Validate that endDateTime is after startDateTime
    if (dateObj2 <= dateObj1) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    const createdBy = req.user.id; // Assuming user data is attached to the request
    // Create a new exam
    const newExam = new Exam({
      title,
      description,
      ageGroup,
      class: level,
      questions,
      timer: duration,
      startDateTime,
      endDateTime,
      selectExamCategory,
      createdBy,
    });
    console.log(newExam)

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
exports.deleteExamQestion=async (req, res) => {
  const { examId, questionIdx } = req.params;

  try {
    // Fetch the exam by ID
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Validate question index
    if (questionIdx < 0 || questionIdx >= exam.questions.length) {
      return res.status(400).json({ message: 'Invalid question index' });
    }

    // Remove the question from the questions array
    exam.questions.splice(questionIdx, 1);

    // Save the updated exam
   await exam.save();

    res.status(200).json({ message: 'Question deleted successfully', exam });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Failed to delete question', error });
  }
}
exports.getscores=async (req, res) => {

  try {
    // Fetch the student's exam data
    const studentExam = await StudentExam.find()
    .sort({ score: -1 }) 
    .limit(5)            
    .populate('userId'); 
    if (!studentExam) {
      return res.status(404).json({ message: 'Exam record not found for the student.' });
    }

    // Return the student name and score
    const response = {
     // studentName: studentExam.userId.name, // Assuming the `name` field exists in the User model
     studentExam
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching student exam data:', error.message);
    res.status(500).json({ message: 'Error fetching student exam data', error: error.message });
  }
}