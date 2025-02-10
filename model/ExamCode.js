const mongoose = require("mongoose");

const ExamCodeSchema = new mongoose.Schema({
  emailStudent: { type: String, required: true }, 
  examId: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now}, // الكود ينتهي بعد ساعة
});

module.exports = mongoose.model("ExamCode", ExamCodeSchema);
