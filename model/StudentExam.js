const mongoose = require('mongoose');

const StudentExamSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam.questions',
      },
      answerText: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        default: false,
      },
    },
  ],
  score: {
    type: Number,
    default: 0,
  },
  submittedAt: {
    type: Date,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

const StudentExam = mongoose.model('StudentExam', StudentExamSchema);

module.exports = StudentExam;
