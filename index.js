const express = require('express');
const mongoose = require('mongoose');
const { PORT, MONGO_URI } = require('./config');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const examRoutes = require('./routes/exam');
const ExamCode = require("./model/ExamCode");

const app = express();
const { authenticateToken, isAuthenticated, isAdmin } = require('./Middleware/CheckPassport');

// Middleware
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PATCH,PUT,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization,x-auth-token, Content-Type, X-Requested-With, Range"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  } else {
    return next();
  }
});
app.post("/generate-code", async (req, res) => {
  try {
    const { emailStudent, examId } = req.body;

    // توليد كود فريد عشوائي من 6 أرقام
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // حفظ الكود في قاعدة البيانات
    const newExamCode = new ExamCode({
      emailStudent,
      examId,
      code,
    });

    await newExamCode.save();

    res.status(201).json({ code, message: "تم إنشاء الكود بنجاح!" });
  } catch (error) {
    res.status(500).json({ error: "حدث خطأ أثناء إنشاء الكود" });
  }
});

app.post("/verify-code", async (req, res) => {
  try {
    const { emailStudent, examId, code } = req.body;

    const validCode = await ExamCode.findOne({ emailStudent, examId, code });

    if (!validCode) {
      return res.status(400).json({ error: "كود غير صحيح أو منتهي الصلاحية" });
    }

    res.status(200).json({ message: "تم التحقق بنجاح، يمكنك بدء الامتحان" });
  } catch (error) {
    res.status(500).json({ error: "حدث خطأ أثناء التحقق من الكود" });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/exam', examRoutes);

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));