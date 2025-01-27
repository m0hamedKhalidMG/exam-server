const mongoose = require('mongoose');
const moment = require('moment');
const ExamSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ageGroup: {
      type: String,
      enum: ['7', '7-10', '10+'],
      required: true,
    },
    class: {
      type: String, // Maps to `level` in the input
      enum: ['A', 'B', 'C'],
      required: true,
    },
    questions: [
      {
        questionText: {
          type: String,
          trim: true,
        },
        correctAnswer: {
          type: mongoose.Schema.Types.Mixed, // Supports various types (e.g., string, number)
          required: true,
        },
        numbers: [
          {
            id: {
              type: Number,
              required: true,
            },
            value: {
              type: String,
              required: true,
            },
          },
        ],
        operations: [
          {
            type: String,
            enum: ['+', '-', '*', '/'], // Allowed operations
            required: true,
          },
        ],
      },
    ],
    timer: {
      type: Number, // Duration in minutes
      required: true,
      min: 1,
    },
    startDateTime: {
      type: String,
      required: true,
    },
    endDateTime: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate endDateTime before saving
// ExamSchema.pre('save', function (next) {
//   if (!this.endDateTime) {
//     const startTime = new Date(this.startDateTime);
//     this.endDateTime = new Date(startTime.getTime() + this.timer * 60000); // Add timer duration in milliseconds
//   }
//   next();
// });

// Method to calculate remaining time
ExamSchema.methods.getRemainingTime = function () {
  const now = new Date();
  const endTime = new Date(this.endDateTime);
  const remainingTime = endTime - now; // Remaining time in milliseconds
  return remainingTime > 0 ? remainingTime : 0; // Return 0 if the exam has expired
};

const Exam = mongoose.model('Exam', ExamSchema);

module.exports = Exam;
