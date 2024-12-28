const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  // 追加フィールド
  imageUrl: String,           // 画像URL
  estimatedSalary: Number,    // 想定年収
  company: { type: String, default: '' }, //社名
  status: { type: String, default: 'draft' },
});

module.exports = mongoose.model('Job', jobSchema);
