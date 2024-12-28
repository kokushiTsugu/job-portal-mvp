////////////////////////////////////////
// backend/models/User.js
////////////////////////////////////////
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // 必須項目
  name: {
    type: String,
    required: true,
  },
  // 追加: 通常ユーザー or 管理者を判別
  role: {
    type: String,
    default: 'user', // 'admin' or 'user'
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  // onChain関連
  onChainLevel: {
    type: Number,
    default: 0,
  },
  completedTasks: {
    type: [String],
    default: [],
  },
  walletAddress: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model('User', userSchema);
