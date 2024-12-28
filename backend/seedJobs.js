////////////////////////////////////////
// backend/seedJobs.js
////////////////////////////////////////

require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./models/job'); // job.js で module.exports = mongoose.model('Job', jobSchema) している想定

// .env などで以下を指定している場合
// MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxx.mongodb.net/sample_mflix
// あるいはローカル: mongodb://localhost:27017/sample_mflix
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sample_mflix';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log("MongoDB接続成功。ジョブシードを開始...");

    // 1) 既存データを全削除
    await Job.deleteMany({}); 
    console.log("jobsコレクションを全削除完了。");

    // 2) 追加したいジョブデータを用意(8件)
    const jobsData = [
      {
        title: "フロントエンドエンジニア",
        company: "ABC Corp",
        location: "東京都",
        imageUrl: "https://picsum.photos/seed/frontend/400/300",
        estimatedSalary: 5000000,  // 単位: 円
        status: "published",
      },
      {
        title: "バックエンドエンジニア",
        company: "XYZ Inc",
        location: "神奈川県",
        imageUrl: "https://picsum.photos/seed/backend/400/300",
        estimatedSalary: 6000000,
        status: "published",
      },
      {
        title: "データサイエンティスト",
        company: "DataWorks",
        location: "大阪府",
        imageUrl: "https://picsum.photos/seed/datasci/400/300",
        estimatedSalary: 7000000,
        status: "published",
      },
      {
        title: "モバイルアプリエンジニア",
        company: "MobilePro",
        location: "福岡県",
        imageUrl: "https://picsum.photos/seed/mobile/400/300",
        estimatedSalary: 5500000,
        status: "published",
      },
      {
        title: "AIリサーチャー",
        company: "AI Innovations",
        location: "東京都",
        imageUrl: "https://picsum.photos/seed/airesearch/400/300",
        estimatedSalary: 8000000,
        status: "published",
      },
      {
        title: "インフラエンジニア",
        company: "CloudNext",
        location: "北海道",
        imageUrl: "https://picsum.photos/seed/infrastructure/400/300",
        estimatedSalary: 6500000,
        status: "published",
      },
      {
        title: "UI/UXデザイナー",
        company: "CreativeStudio",
        location: "京都府",
        imageUrl: "https://picsum.photos/seed/uiux/400/300",
        estimatedSalary: 4800000,
        status: "published",
      },
      {
        title: "プロジェクトマネージャー",
        company: "FutureTech",
        location: "愛知県",
        imageUrl: "https://picsum.photos/seed/pjmanager/400/300",
        estimatedSalary: 7500000,
        status: "published",
      },
    ];

    // 3) 上記データをinsertManyで一括挿入
    await Job.insertMany(jobsData);

    console.log("ジョブデータ 8件の挿入が完了しました。");
    process.exit(0);
  })
  .catch((err) => {
    console.error("MongoDB接続エラー:", err);
    process.exit(1);
  });
