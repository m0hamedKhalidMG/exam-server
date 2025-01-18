const Exam = require('../model/Exam');
const StudentExam = require('../model/StudentExam');





exports.startExam = async (req, res) => {
    try {
      const { examId } = req.body;
      const exam = await Exam.findById(examId);
  
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }
      const now = new Date();
      const options = { timeZone: 'Asia/Riyadh', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      
      // Format the date to Riyadh timezone
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const date = new Date(formatter.format(now));

      // console.log(formatter.format(now))
    //   console.log(exam.startDateTime)

      if (date < new Date(exam.startDateTime) || now > new Date(exam.endDateTime)) {
        return res.status(400).json({ message: 'Exam is not available at this time' });
      }
  
      const studentExam = new StudentExam({
        userId: req.user._id,
        examId,
        startTime: now,
        endTime: new Date(now.getTime() + exam.timer * 60000),
      });
  
      await studentExam.save();
      res.status(201).json({ message: 'Exam started', studentExam });
    } catch (error) {
      res.status(500).json({ message: 'Error starting exam', error: error.message });
    }
  };
  


// Submit an exam
exports.submitExam = async (req, res) => {
  try {
    const { studentExamId } = req.params;
    const { answers } = req.body; // Format: { questionId: "answerText" }

    const studentExam = await StudentExam.findById(studentExamId).populate('examId');
    if (!studentExam) return res.status(404).json({ message: 'Student exam not found' });

    if (new Date() > studentExam.endTime) {
      return res.status(400).json({ message: 'Time for this exam has expired' });
    }

    let score = 0;
    const updatedAnswers = studentExam.examId.questions.map((question) => {
      const userAnswer = answers[question._id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) score++;

      return {
        questionId: question._id,
        answerText: studentAnswer?.answerText || '',
        isCorrect,
      };
    });

    studentExam.answers = updatedAnswers;
    studentExam.score = score;
    studentExam.submittedAt = new Date();
    await studentExam.save();

    res.status(200).json({ message: 'Exam submitted successfully', score });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting exam', error: error.message });
  }
};


// Fetch exam history
exports.getExamHistory = async (req, res) => {
    try {
      const history = await StudentExam.find({ userId: req.user._id })
        .populate('examId', 'title description') // Populate exam title and description
        .populate('answers.questionId', 'questionText correctAnswer'); // Populate question text and correct answers
  
      res.status(200).json({ history });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching history', error: error.message });
    }
  };
  

  exports.autoCloseExam = async () => {
    try {
      const now = new Date();
      const examsToClose = await StudentExam.find({ endTime: { $lte: now }, submittedAt: null });
  
      examsToClose.forEach(async (exam) => {
        exam.submittedAt = now;
        await exam.save();
      });
      console.log(`Closed ${examsToClose.length} expired exams.`);
    } catch (error) {
      console.error('Error auto-closing exams:', error.message);
    }
  };