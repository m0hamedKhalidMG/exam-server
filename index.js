const express = require('express');
const mongoose = require('mongoose');
const { PORT, MONGO_URI } = require('./config');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
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
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));