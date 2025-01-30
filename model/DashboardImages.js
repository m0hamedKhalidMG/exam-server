const mongoose = require('mongoose');

const DashboardImageSchema = new mongoose.Schema({
  adminBg: { type: String, required: true },
  userBg: { type: String, required: true }
});

module.exports = mongoose.model('DashboardImage', DashboardImageSchema);
