////////////////////////////////////////
// backend/index.js (修正版・全文)
////////////////////////////////////////
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
// ======= ethers v5
const ethers = require('ethers');

// ====== Models ======
const User = require('./models/User');
const Job = require('./models/job');
const Application = require('./models/Application');
const Interview = require('./models/Interview');

// ====== Setup ======
const app = express();
const PORT = process.env.PORT || 8080;

// ---- 追加: adminRoutes ----
const adminRoutes = require('./routes/adminRoutes');

// Basic Auth is now handled by the tunnel service

// ====== CORS設定 ======
// CORS configuration to allow Vercel frontend and local development
const allowedOrigins = [
  'https://job-portal-mvp-git-main-kokushitsugus-projects.vercel.app',
  'https://job-portal-mvp.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow direct API access (no origin)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed for this origin'), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Error handler for CORS violations
app.use((err, req, res, next) => {
  if (err.message === 'CORS not allowed for this origin') {
    return res.status(403).json({ 
      error: 'CORS Error', 
      message: 'Access not allowed from this origin' 
    });
  }
  next(err);
});

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle preflight requests
app.options('*', cors());

// ====== Connect to Mongo ======
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDBに接続しました');
  } catch (err) {
    console.error('MongoDB接続エラー:', err);
    // Retry connection after 5 seconds
    console.log('5秒後に再接続を試みます...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// ====== Auth Middleware ======
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
  if (!req.role || req.role !== 'admin') {
    return res.status(403).json({ message: '管理者権限が必要です。' });
  }
  next();
};

// ====== Multer Setup ======
const uploadDir = process.env.UPLOAD_DIR || 'uploads/resumes/';

// Ensure upload directory exists
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ====== Web3署名チャレンジ管理 ======
let challenges = {};

// -------------------------------------
// User Register & Login (既存)
// -------------------------------------
app.post('/register',
  [
    body('name').notEmpty().withMessage('名前は必須です。'),
    body('email').isEmail().withMessage('有効なメールアドレスを入力してください。'),
    body('password').isLength({ min: 6 }).withMessage('パスワードは6文字以上です。'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'バリデーションエラー', errors: errors.array() });
      }

      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'このメールアドレスは既に登録されています。' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ 
        name, 
        email, 
        password: hashedPassword,
        role: 'user'
      });
      const savedUser = await newUser.save();

      // JWT発行
      const token = jwt.sign(
        { userId: savedUser._id, role: savedUser.role },
        process.env.JWT_SECRET || 'your_secret_key',
        { expiresIn: '1h' }
      );
      res.status(201).json({
        message: 'ユーザー登録が成功しました',
        token,
        name: savedUser.name,
        email: savedUser.email
      });
    } catch (error) {
      console.error('ユーザー登録エラー:', error);
      res.status(500).json({ message: 'ユーザー登録に失敗しました', error: error.message });
    }
  }
);

app.post('/login',
  [
    body('email').isEmail().withMessage('有効なメールアドレスを入力してください。'),
    body('password').notEmpty().withMessage('パスワードは必須です。'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'バリデーションエラー', errors: errors.array() });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'ユーザーが見つかりません' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: '認証に失敗しました' });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role }, 
        process.env.JWT_SECRET || 'your_secret_key',
        { expiresIn: '1h' }
      );
      res.json({
        message: 'ログインに成功しました',
        token,
        name: user.name,
        email: user.email
      });
    } catch (error) {
      console.error('ログインエラー:', error);
      res.status(500).json({ message: 'ログインに失敗しました', error: error.message });
    }
  }
);

// -------------------------------------
// Admin Register & Login
// -------------------------------------
app.post('/admin/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'メールアドレスとパスワードは必須です。' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '既に登録されています。' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      name: name || '管理者',
      email,
      password: hashedPassword,
      role: 'admin'
    });
    await newAdmin.save();

    const token = jwt.sign(
      { userId: newAdmin._id, role: 'admin' },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1h' }
    );

    return res.json({
      message: 'Adminユーザーが作成されました。',
      token,
      role: 'admin'
    });
  } catch (err) {
    console.error('[admin/register]エラー:', err);
    res.status(500).json({ message: 'Adminユーザー作成に失敗しました。' });
  }
});

app.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email, passwordは必須です。' });
    }

    const adminUser = await User.findOne({ email, role: 'admin' });
    if (!adminUser) {
      return res.status(404).json({ message: '管理ユーザーが見つかりません。' });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'パスワードが違います。' });
    }

    const token = jwt.sign(
      { userId: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1h' }
    );

    return res.json({ 
      message: 'adminログイン成功',
      token,
      role: adminUser.role,
    });
  } catch (err) {
    console.error('[admin/login]エラー:', err);
    res.status(500).json({ message: 'Adminログインでエラーが発生しました。' });
  }
});

// -------------------------------------
// Interviews (省略可)
// -------------------------------------
app.get('/interviews', async (req, res) => {
  try {
    const interviews = await Interview.find({});
    res.json({ interviews });
  } catch (err) {
    console.error('インタビュー一覧取得エラー:', err);
    res.status(500).json({ message: 'インタビュー一覧取得に失敗しました' });
  }
});

app.get('/interviews/:id', async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'インタビューが見つかりません' });
    }
    res.json({ interview });
  } catch (error) {
    console.error('インタビュー詳細取得エラー:', error);
    res.status(500).json({ message: 'インタビュー詳細の取得に失敗しました', error: error.message });
  }
});

// -------------------------------------
// Jobs (一般公開用GET)
app.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.json({
      jobs,
      total: jobs.length,
      page: 1,
      pages: 1,
    });
  } catch (err) {
    console.error('ジョブ一覧取得エラー:', err);
    res.status(500).json({ message: 'ジョブ一覧の取得に失敗しました' });
  }
});

app.get('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('ジョブ詳細取得エラー:', error);
    res.status(500).json({ message: 'ジョブ詳細の取得に失敗しました', error: error.message });
  }
});

// -------------------------------------
// Applications (ダミー)
app.get('/applications', authenticateUser, async (req, res) => {
  try {
    const applications = [
      { _id: "aaa", jobTitle: "エンジニア", status: "applied" },
      { _id: "bbb", jobTitle: "デザイナー", status: "passed" }
    ];
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '応募一覧の取得に失敗しました' });
  }
});

app.post('/applications', authenticateUser,
  [
    body('jobId').notEmpty().withMessage('ジョブIDは必須です。'),
    body('name').notEmpty().withMessage('名前は必須です。'),
    body('email').isEmail().withMessage('有効なメールアドレスを入力してください。'),
  ],
  async (req, res) => {
    res.json({ message: 'applications post dummy' });
  }
);

// -------------------------------------
// Admin Stats (企業KPI + 求職者KPI)
// -------------------------------------
app.get('/admin/stats', authenticateUser, authenticateAdmin, async (req, res) => {
  try {
    // 企業系KPI
    const jobsCount = await Job.countDocuments({ status: 'published' });
    const applicationsCount = await Application.countDocuments({});
    const scoutsSent = 120;
    const scoutsReplied = 90;
    const scoutReplyRateNum = scoutsSent > 0 ? (scoutsReplied / scoutsSent * 100).toFixed(2) : 0;
    const scoutReplyRate = scoutReplyRateNum + '%';

    // 求職者KPI (例)
    const totalUsers = await User.countDocuments({ role: 'user' });
    // onChainLevel > 0 をアクティブと仮定
    const activeUsers = await User.countDocuments({ role: 'user', onChainLevel: { $gt: 0 }});

    res.json({
      // 企業系
      jobsCount,
      applicationsCount,
      scoutReplyRate,
      // 求職者系
      totalUsers,
      activeUsers
    });
  } catch (error) {
    console.error('Stats取得エラー:', error);
    res.status(500).json({ message: 'Stats取得に失敗しました', error: error.message });
  }
});

// -------------------------------------
// /user/me (onChainLevelなど)
app.get('/user/me', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません。' });
    }
    res.json({
      name: user.name,
      email: user.email,
      onChainLevel: user.onChainLevel,
      completedTasks: user.completedTasks,
      walletAddress: user.walletAddress
    });
  } catch (error) {
    console.error('GET /user/me エラー:', error);
    res.status(500).json({ message: 'ユーザー情報取得に失敗しました' });
  }
});

// -------------------------------------
// Web3署名: /web3/request-challenge & /web3/verify
app.get('/web3/request-challenge', authenticateUser, (req, res) => {
  try {
    const userId = req.userId;
    const randomChallenge = crypto.randomBytes(16).toString('hex');
    challenges[userId] = randomChallenge;
    res.json({ challenge: randomChallenge });
  } catch (error) {
    console.error('request-challengeエラー:', error);
    return res.status(500).json({ message: 'チャレンジ生成に失敗しました' });
  }
});

app.post('/web3/verify', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;
    const { address, signature } = req.body;

    if (!address || !signature) {
      return res.status(400).json({ message: 'address または signature がありません。' });
    }

    const challenge = challenges[userId];
    if (!challenge) {
      return res.status(400).json({ message: 'チャレンジが見つかりません。' });
    }

    // ethers v5
    const recoveredAddress = ethers.utils.verifyMessage(challenge, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ message: '署名検証に失敗しました' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません。' });
    }

    user.walletAddress = address;
    if (!user.completedTasks.includes('wallet-connect')) {
      user.completedTasks.push('wallet-connect');
    }
    // 簡易レベル計算 etc...
    await user.save();

    delete challenges[userId];
    return res.json({
      message: '署名検証OK。ウォレット連携＆タスク完了！',
      onChainLevel: user.onChainLevel,
      completedTasks: user.completedTasks,
      walletAddress: user.walletAddress
    });
  } catch (error) {
    console.error('verifyエラー:', error);
    return res.status(500).json({ message: '署名検証に失敗しました', error: error.message });
  }
});

// -------------------------------------
// ここが重要: Admin用ルートを有効化
app.use('/admin', adminRoutes);

// ====== Server Listen ======
app.listen(PORT, () => {
  console.log(`サーバーが http://localhost:${PORT} で稼働中`);
});
