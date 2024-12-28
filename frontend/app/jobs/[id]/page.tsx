"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BriefcaseIcon, MapPinIcon, CurrencyYenIcon } from '@heroicons/react/24/solid';

export default function JobDetailPage() {
  const params = useParams();
  const { id } = params;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // 仮データ: 実際はAPIから取得
  useEffect(() => {
    // モックデータ
    const mockJob = {
      title: "フロントエンドエンジニア",
      company: "ABC Corp",
      location: "東京都 港区",
      salary: "600万〜800万円",
      employmentType: "正社員",
      imageUrl: "https://picsum.photos/seed/company/1200/400", // バナー画像
      companyLogo: "https://picsum.photos/seed/logo/100/100", // 企業ロゴ
      description: "当社は成長中のスタートアップとして、WEBサービスの開発・運用を行っています。新規事業立ち上げに伴いフロントエンドエンジニアを募集します。",
      details: {
        jobDescription: "【業務内容】\n- 新規機能のUI/UX設計および実装\n- パフォーマンス最適化\n- デザイナー/バックエンドと連携したアジャイル開発",
        requirements: "【必須条件】\n- ReactやVue.jsなどのSPAフレームワークでの開発経験\n- HTML/CSS/JavaScriptの深い理解\n【歓迎条件】\n- TypeScriptを用いた開発経験\n- UI/UXへの強い関心",
        idealCandidate: "【求める人物像】\n- 自走して問題解決できる方\n- チームワークを大切にする方\n- 新しい技術への好奇心が強い方",
        process: "【選考プロセス】\n書類選考 → オンライン面接(2〜3回) → 内定",
      }
    };
    setTimeout(() => {
      setJob(mockJob);
      setLoading(false);
    }, 500);

  }, [id]);

  if (loading) return <div className="text-center py-10">読み込み中...</div>;
  if (message) return <div className="text-center py-10 text-red-500">{message}</div>;
  if (!job) return <div className="text-center py-10 text-red-500">ジョブが見つかりませんでした。</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* トップバー: 企業ロゴ＋職種名＋応募ボタン */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={job.companyLogo} alt={job.company} className="w-10 h-10 rounded-full object-cover" />
            <h1 className="text-lg font-semibold text-gray-800">{job.title}</h1>
          </div>
          <a
            href="#apply"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
          >
            応募する
          </a>
        </div>
      </header>

      {/* メインビジュアルエリア */}
      <div className="relative w-full h-60 overflow-hidden">
        {job.imageUrl && (
          <img
            src={job.imageUrl}
            alt={job.title}
            className="w-full h-full object-cover absolute inset-0"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <h2 className="text-3xl font-extrabold text-white drop-shadow">{job.title}</h2>
          <p className="text-white text-sm mt-1">{job.company} | {job.location}</p>
        </div>
      </div>

      {/* コンテンツエリア */}
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row md:space-x-8">
        {/* メインカラム */}
        <div className="flex-1 space-y-8">
          {/* 給与・雇用形態などの情報 */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 text-gray-700">
              <CurrencyYenIcon className="w-5 h-5 text-indigo-600" />
              <p className="text-sm font-medium">想定年収: <span className="font-semibold">{job.salary}</span></p>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <BriefcaseIcon className="w-5 h-5 text-indigo-600" />
              <p className="text-sm font-medium">雇用形態: <span className="font-semibold">{job.employmentType}</span></p>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <MapPinIcon className="w-5 h-5 text-indigo-600" />
              <p className="text-sm font-medium">勤務地: <span className="font-semibold">{job.location}</span></p>
            </div>
          </div>

          {/* 募集要項(タブ風にセクションわけ) */}
          <div className="space-y-8">
            {/* 募集背景・業務内容 */}
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">募集背景・業務内容</h3>
              <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{job.details.jobDescription}</p>
            </section>

            {/* 応募条件 */}
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">応募条件</h3>
              <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{job.details.requirements}</p>
            </section>

            {/* 求める人物像 */}
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">求める人物像</h3>
              <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{job.details.idealCandidate}</p>
            </section>

            {/* 選考プロセス */}
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">選考プロセス</h3>
              <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{job.details.process}</p>
            </section>
          </div>
        </div>

        {/* サイドバー: 応募ボックス固定表示 */}
        <div className="hidden md:block md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div id="apply" className="bg-white rounded-lg shadow p-6 space-y-4">
              <p className="text-gray-700 text-sm">この求人に応募しますか？</p>
              <a
                href="/applications"
                className="block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded text-center transition-colors"
              >
                応募する
              </a>
              <p className="text-xs text-gray-400 mt-2">
                応募にはログインが必要です。<br />未登録の方は新規登録を行ってください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
