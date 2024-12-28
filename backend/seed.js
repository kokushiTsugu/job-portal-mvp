// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./models/job');

const MONGODB_URI = process.env.MONGODB_URI;

const jobsData = [
  {
    title: "フロントエンドエンジニア",
    company: "ABC Corp",
    location: "東京都",
    estimatedSalary: 5000000,
    employmentType: "正社員",
    featured: true,
    jobType: "full-time",
    workplace: "onsite",
    imageUrl: "https://picsum.photos/seed/1/400/300",
  },
  {
    title: "バックエンドエンジニア",
    company: "XYZ Inc",
    location: "神奈川県",
    estimatedSalary: 6000000,
    employmentType: "契約社員",
    featured: false,
    jobType: "part-time",
    workplace: "remote",
    imageUrl: "https://picsum.photos/seed/2/400/300",
  },
  {
    title: "データサイエンティスト",
    company: "DataWorks",
    location: "大阪府",
    estimatedSalary: 7000000,
    employmentType: "正社員",
    featured: false,
    jobType: "full-time",
    workplace: "hybrid",
    imageUrl: "https://picsum.photos/seed/3/400/300",
  },
  {
    title: "UX/UIデザイナー",
    company: "CreativeStudio",
    location: "東京都",
    estimatedSalary: 5500000,
    employmentType: "正社員",
    featured: true,
    jobType: "full-time",
    workplace: "onsite",
    imageUrl: "https://picsum.photos/seed/4/400/300",
  },
  {
    title: "プロジェクトマネージャー",
    company: "TechLead",
    location: "福岡県",
    estimatedSalary: 8000000,
    employmentType: "正社員",
    featured: false,
    jobType: "full-time",
    workplace: "onsite",
    imageUrl: "https://picsum.photos/seed/5/400/300",
  },
  {
    title: "QAエンジニア",
    company: "QualityFirst",
    location: "北海道",
    estimatedSalary: 4500000,
    employmentType: "派遣",
    featured: false,
    jobType: "side-job",
    workplace: "remote",
    imageUrl: "https://picsum.photos/seed/6/400/300",
  },
  {
    title: "データエンジニア",
    company: "BigDataCorp",
    location: "京都府",
    estimatedSalary: 6500000,
    employmentType: "正社員",
    featured: true,
    jobType: "full-time",
    workplace: "hybrid",
    imageUrl: "https://picsum.photos/seed/7/400/300",
  },
  {
    title: "機械学習エンジニア",
    company: "AI Solutions",
    location: "愛知県",
    estimatedSalary: 9000000,
    employmentType: "正社員",
    featured: false,
    jobType: "full-time",
    workplace: "onsite",
    imageUrl: "https://picsum.photos/seed/8/400/300",
  },
  {
    title: "カスタマーサクセス",
    company: "CustomerFirst",
    location: "千葉県",
    estimatedSalary: 4000000,
    employmentType: "正社員",
    featured: false,
    jobType: "part-time",
    workplace: "remote",
    imageUrl: "https://picsum.photos/seed/9/400/300",
  },
  {
    title: "iOSエンジニア",
    company: "MobileTech",
    location: "兵庫県",
    estimatedSalary: 7500000,
    employmentType: "正社員",
    featured: true,
    jobType: "side-job",
    workplace: "hybrid",
    imageUrl: "https://picsum.photos/seed/10/400/300",
  },
];

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("MongoDB接続成功。シード投入開始...");
    await Job.deleteMany({});
    await Job.insertMany(jobsData);
    console.log("ジョブデータ投入完了！");
    process.exit(0);
  })
  .catch((err) => {
    console.error("MongoDB接続エラー:", err);
    process.exit(1);
  });
