// backend/models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  resume: { type: String },
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['応募中', '選考中', '採用', '不採用'], default: '応募中' },
});

module.exports = mongoose.model('Application', applicationSchema);
