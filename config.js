require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.ATLAS_URL,
  JWT_SECRET: process.env.JWT_SECRET,
};