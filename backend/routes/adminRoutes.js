/////////////////////////////////////////////
// backend/routes/adminRoutes.js
/////////////////////////////////////////////
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Job = require('../models/job');
const Application = require('../models/Application'); // 応募数をカウントするため

// ミドルウェア
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: '認証トークンがありません。' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    console.error('トークン認証エラー:', error);
    return res.status(401).json({ message: '無効なトークンです。' });
  }
};

const authenticateAdmin = (req, res, next) => {
  if (req.role !== 'admin') {
    return res.status(403).json({ message: '管理者権限が必要です。' });
  }
  next();
};

// ------------------------------------------
// Admin: 求人一覧 (会社名 & 応募数を返す)
// GET /admin/jobs
// ------------------------------------------
router.get('/jobs', authenticateUser, authenticateAdmin, async (req, res) => {
  try {
    // 全求人を取得
    const jobs = await Job.find({});

    // 応募数をカウント
    // job._id に紐づく Application を数える
    const jobsWithCounts = [];
    for (const job of jobs) {
      const count = await Application.countDocuments({ jobId: job._id });
      jobsWithCounts.push({
        _id: job._id,
        title: job.title,
        description: job.description,
        status: job.status,
        company: job.company,
        applicationCount: count,
      });
    }

    return res.json({ jobs: jobsWithCounts });
  } catch (error) {
    console.error('求人一覧取得エラー:', error);
    return res.status(500).json({ message: '求人一覧の取得に失敗しました' });
  }
});

// ------------------------------------------
// Admin: 求人作成
// POST /admin/jobs
// ------------------------------------------
router.post('/jobs', authenticateUser, authenticateAdmin, async (req, res) => {
  try {
    const { title, description, status, company } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'タイトルは必須です。' });
    }
    const newJob = new Job({
      title,
      description: description || '',
      status: status || 'published',
      company: company || '',
    });
    await newJob.save();

    return res.json({ message: '求人が作成されました。', job: newJob });
  } catch (error) {
    console.error('求人作成エラー:', error);
    return res.status(500).json({ message: '求人作成に失敗しました' });
  }
});

// ------------------------------------------
// Admin: 求人削除
// DELETE /admin/jobs/:id
// ------------------------------------------
router.delete('/jobs/:id', authenticateUser, authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Job.findByIdAndDelete(id);
    return res.json({ message: '求人を削除しました。' });
  } catch (error) {
    console.error('求人削除エラー:', error);
    return res.status(500).json({ message: '求人削除に失敗しました' });
  }
});

// ------------------------------------------
// Admin: 求人詳細
// GET /admin/jobs/:id
// ------------------------------------------
router.get('/jobs/:id', authenticateUser, authenticateAdmin, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: '求人が見つかりません。' });
    }
    return res.json({ job });
  } catch (error) {
    console.error('求人詳細取得エラー:', error);
    return res.status(500).json({ message: '求人詳細取得に失敗しました' });
  }
});

// ------------------------------------------
// Admin: 求人更新
// PUT /admin/jobs/:id
// ------------------------------------------
router.put('/jobs/:id', authenticateUser, authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, company } = req.body;
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { title, description, status, company },
      { new: true }
    );
    if (!updatedJob) {
      return res.status(404).json({ message: '求人が見つかりません。' });
    }
    return res.json({ message: '求人を更新しました。', job: updatedJob });
  } catch (error) {
    console.error('求人更新エラー:', error);
    return res.status(500).json({ message: '求人更新に失敗しました' });
  }
});

module.exports = router;
