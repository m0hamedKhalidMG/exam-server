const Exam = require('../model/Exam');
const StudentExam = require('../model/StudentExam');

exports.getAllExamsforstudent = async (req, res) => {
  try {
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
    const currentDate = new Date();
    const formattedCurrentDate = new Intl.DateTimeFormat("en-US", options).format(currentDate);
    console.log("Current Date:", formattedCurrentDate);

    const exams = await Exam.find().populate('createdBy', 'username email');
   

    const filteredExams1 = exams.filter((exam) => new Date(exam.endDateTime) >= currentDate);
    const filteredExams = filteredExams1.filter((exam) => new Date(exam.startDateTime) <= currentDate);



    res.status(200).json(filteredExams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exams', error: error.message });
  }
};



exports.startExam = async (req, res) => {
  try {
    const { userId, examId } = req.body;
    const exam = await Exam.findById(examId);
    const existingExam = await StudentExam.findOne({ userId, examId });

    if (existingExam) {
      return res.status(400).json({ message: 'You have already started this exam.' });
    }

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

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

    // Convert the date strings to Date objects
    const dateObjstartDateTime = new Date(exam.startDateTime);
    const dateObjendDateTime = new Date(exam.endDateTime);

    // Get the current date and time
    const currentDate = new Date();
    const formattedCurrentDate = new Intl.DateTimeFormat("en-US", options).format(currentDate);

    // Check if the exam is available at this time
    if (currentDate < dateObjstartDateTime || currentDate > dateObjendDateTime) {
      return res.status(400).json({ message: 'Exam is not available at this time' });
    }

    // Calculate the end time of the exam
    const endTime = new Date(currentDate.getTime() + exam.timer * 60000);
    const formattedEndTime = new Intl.DateTimeFormat("en-US", options).format(endTime);

    const studentExam = new StudentExam({
      userId,
      examId,
      startTime: formattedCurrentDate,
      endTime: formattedEndTime,
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
    const { userId, examId, answers,score,timeexam,total } = req.body;
console.log(req.body)

    const studentExam = await StudentExam.findOne({ userId, examId }).populate('examId');
   
    if (!studentExam) return res.status(404).json({ message: 'Student exam not found' });
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

    // Convert the date strings to Date objects
    const dateObjendDateTime = new Date(studentExam.endTime);

    // Get the current date and time
    const currentDate = new Date();
    const formattedCurrentDate = new Intl.DateTimeFormat("en-US", options).format(currentDate);

    if (formattedCurrentDate > dateObjendDateTime) {
      return res.status(400).json({ message: 'Time for this exam has expired' });
    }
    if (studentExam.submittedAt) {
      return res.status(400).json({ message: 'You have already submitted this exam.' });
    }
    studentExam.total=total
    studentExam.answers = answers;
    studentExam.score = score;
    studentExam.timeexam=timeexam;
    studentExam.submittedAt = formattedCurrentDate;
    await studentExam.save();

    res.status(200).json({ message: 'Exam submitted successfully', score });
  } catch (error) {
    
    res.status(500).json({ message: 'Error submitting exam', error: error.message });
  }
};


// Fetch exam history
exports.getExamHistory = async (req, res) => {
    try {
      const history = await StudentExam.find().populate("userId")
      
  
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