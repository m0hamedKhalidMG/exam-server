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
   
  ],
  score: {
    type: Number,
    default: 0,
  },
  timeexam: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  submittedAt: {
    type: Date,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  selectExamCategory: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const StudentExam = mongoose.model('StudentExam', StudentExamSchema);

module.exports = StudentExam;
