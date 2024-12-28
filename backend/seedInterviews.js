// backend/seedInterviews.js

require('dotenv').config();
const mongoose = require('mongoose');
const Interview = require('./models/Interview');

const MONGODB_URI = process.env.MONGODB_URI;
const interviewsData = [
  {
    title: "スペシャルインタビュー：先端スタートアップCEO",
    subtitle: "「AI時代の日本を牽引するリーダー像」",
    company: "TechVision Inc.",
    category: "tech",
    imageUrl: "https://picsum.photos/seed/interview1/800/500",
    postedAt: new Date('2024-01-10'),
    content: `【序章】
ここは都内某所のオフィスビル、最先端スタートアップ「TechVision Inc.」本社。
創業からわずか5年で業界注目を浴びるこの企業を率いるCEOが、
AIと社会の未来について語る。

【インタビュー抜粋】
Q: 「今、日本のスタートアップが世界と戦う上で必要な視点は？」
A: 「スピードと独自性ですね。私たちTechVisionは、常に新しい価値を創造するべく挑戦を続けています。...」

【まとめ】
このCEOは、テクノロジーが生活を根底から変え、人々の働き方や価値観さえも刷新する時代を見据えているようだ。
`,
    tags: ["スタートアップ", "AI", "テクノロジー"]
  },
  {
    title: "著名クリエイティブディレクターが語るデザイン哲学",
    subtitle: "「ユーザーの心を掴むUI/UXとは？」",
    company: "Creative Studio",
    category: "creative",
    imageUrl: "https://picsum.photos/seed/interview2/800/500",
    postedAt: new Date('2024-01-12'),
    content: `【序章】
パリと東京を拠点に活躍するデザイン事務所「Creative Studio」。
そのディレクターは、美しいUI/UXこそがユーザー体験の核心を成すと説く。

【インタビュー抜粋】
Q: 「良いデザインとは何でしょうか？」
A: 「良いデザインとは、『気づかれないデザイン』でもあります。ユーザーが直感的に利用でき、快適だと感じるプロダクトには、実は細やかな配慮と工夫が凝らされています。...」

【まとめ】
クリエイターが注視するのは、見た目の美しさだけでなく、ユーザーがストレスなく使える流れや、心地よいインタラクション。その探求は終わることがない。
`,
    tags: ["クリエイティブ", "UI", "UX"]
  },
  // 必要ならさらなるインタビューを追加可能
];

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("MongoDB接続成功。インタビューシード投入開始...");
    await Interview.deleteMany({});
    await Interview.insertMany(interviewsData);
    console.log("インタビューデータ投入完了！");
    process.exit(0);
  })
  .catch((err) => {
    console.error("MongoDB接続エラー:", err);
    process.exit(1);
  });
