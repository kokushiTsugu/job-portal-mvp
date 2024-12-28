const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  company: String,
  category: String,
  imageUrl: String,
  postedAt: Date,
  content: String,
  tags: [String],
});

module.exports = mongoose.model('Interview', interviewSchema);
