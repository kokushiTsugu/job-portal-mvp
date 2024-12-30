"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// インタビュー型定義
interface Interview {
  _id: string;
  title: string;
  subtitle?: string;
  company?: string;
  category?: string;
  imageUrl?: string;
  postedAt?: string;
}

// ジョブ型定義
interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  imageUrl?: string;
  estimatedSalary?: number; // ここを追加
}

export default function HomePage() {
  // インタビュー取得用
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [interviewsLoading, setInterviewsLoading] = useState(true);
  const [interviewsError, setInterviewsError] = useState("");

  // ジョブ取得用
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");

  useEffect(() => {
    // ----- インタビュー一覧を取得 -----
    const fetchInterviews = async () => {
      try {
        const res = await fetch("http://localhost:8080/interviews", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("インタビュー一覧の取得に失敗しました");
        }
        const data = await res.json();
        setInterviews(data.interviews || []);
      } catch (error: any) {
        console.error(error);
        setInterviewsError("インタビュー一覧の取得に失敗しました。");
      } finally {
        setInterviewsLoading(false);
      }
    };

    // ----- おすすめポジション(ジョブ)を取得 -----
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:8080/jobs", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("ジョブ一覧の取得に失敗しました");
        }
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (error: any) {
        console.error(error);
        setJobsError("おすすめポジションの取得に失敗しました。");
      } finally {
        setJobsLoading(false);
      }
    };

    fetchInterviews();
    fetchJobs();
  }, []);

  const highlightedInterviews = interviews.slice(0, 3);
  const recommendedJobs = jobs.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* Heroセクション */}
      <div className="relative w-full h-96 bg-gray-200 overflow-hidden">
        <img
          src="https://picsum.photos/seed/hero/1200/600"
          alt="Hero background"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-8 left-8 z-10">
          <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow">
            キャリアアップへの一歩を踏み出そう
          </h1>
          <p className="text-white text-sm mb-4 drop-shadow">
            あなたに合った非公開求人や注目のポジションへアクセスできます
          </p>
          <Link href="/register">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors">
              今すぐ会員登録（無料）
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* 注目のインタビュー */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8">注目のインタビュー</h2>
        {interviewsLoading && <div className="text-center py-4 text-gray-500">インタビュー読み込み中...</div>}
        {interviewsError && <div className="text-center py-4 text-red-500">{interviewsError}</div>}
        {!interviewsLoading && !interviewsError && highlightedInterviews.length === 0 && (
          <p className="text-center text-gray-700 mb-10">現在注目のインタビューはありません。</p>
        )}
        {!interviewsLoading && !interviewsError && highlightedInterviews.length > 0 && (
          <>
            <p className="text-gray-700 mb-6">
              業界リーダーや話題のスタートアップCEO、クリエイティブなプロフェッショナルのインタビューをチェック！
            </p>
            <div className="grid gap-8 sm:grid-cols-3 mb-8">
              {highlightedInterviews.map((interview) => (
                <div key={interview._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
                  {interview.imageUrl && (
                    <img src={interview.imageUrl} alt={interview.title} className="w-full h-48 object-cover rounded-md mb-4" />
                  )}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{interview.title}</h3>
                  {interview.subtitle && <p className="text-sm text-gray-600 mb-2 line-clamp-2">{interview.subtitle}</p>}
                  {interview.company && <p className="text-sm text-gray-500 mb-2">by {interview.company}</p>}
                  <Link href={`/interviews/${interview._id}`}>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded transition-colors">
                      詳細を見る
                    </button>
                  </Link>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-4 mb-16">
              <Link href="/interviews">
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded transition-colors">
                  インタビュー一覧を見る
                </button>
              </Link>
            </div>
          </>
        )}

        {/* おすすめポジション */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8">おすすめポジション</h2>
        {jobsLoading && <div className="text-center py-4 text-gray-500">おすすめポジション読み込み中...</div>}
        {jobsError && <div className="text-center py-4 text-red-500">{jobsError}</div>}
        {!jobsLoading && !jobsError && recommendedJobs.length === 0 && (
          <p className="text-center text-gray-700 mb-10">現在おすすめポジションはありません。</p>
        )}
        {!jobsLoading && !jobsError && recommendedJobs.length > 0 && (
          <>
            <p className="text-gray-700 mb-6">
              厳選したポジションをピックアップ！非公開求人も多数、あなたに合ったキャリアを見つけてください。
            </p>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {recommendedJobs.map((job) => (
                <div key={job._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
                  {/* 画像表示 */}
                  {job.imageUrl && (
                    <img src={job.imageUrl} alt={job.title} className="w-full h-48 object-cover rounded-md mb-4" />
                  )}
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-500 mb-1">{job.company} | {job.location}</p>
                  {/* 想定年収を追加表示 */}
                  {job.estimatedSalary && (
                    <p className="text-sm text-gray-700 mb-4">
                    想定年収: {Math.floor(job.estimatedSalary / 10000)}万円
                  </p>
                  )}
                  <Link href={`/jobs/${job._id}`}>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded transition-colors">
                      詳細を見る
                    </button>
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-16">
              <Link href="/jobs">
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded transition-colors">
                  もっと見る
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors">
                  会員登録して非公開求人へアクセス
                </button>
              </Link>
            </div>
          </>
        )}

        {/* サービスの特徴など */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8">私たちのサービスの特徴</h2>
        <div className="grid gap-8 sm:grid-cols-3 mb-16">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <img src="/icons/secret-jobs.png" alt="非公開求人" className="w-12 h-12 mx-auto mb-4"/>
            <h4 className="text-lg font-bold text-gray-800 mb-2">非公開求人多数</h4>
            <p className="text-sm text-gray-700">一般公開されない希少な求人にもアクセス可能</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <img src="/icons/support.png" alt="サポート" className="w-12 h-12 mx-auto mb-4"/>
            <h4 className="text-lg font-bold text-gray-800 mb-2">専任コンサルタントのサポート</h4>
            <p className="text-sm text-gray-700">キャリア相談から面接対策までフルサポート</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <img src="/icons/career.png" alt="キャリア" className="w-12 h-12 mx-auto mb-4"/>
            <h4 className="text-lg font-bold text-gray-800 mb-2">キャリアアップ支援</h4>
            <p className="text-sm text-gray-700">あなたの目標に合わせたステップアップが可能</p>
          </div>
        </div>

        <div className="bg-indigo-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">今すぐ会員登録して、新しいキャリアの扉を開こう</h3>
          <Link href="/register">
            <button className="bg-white hover:bg-gray-100 text-indigo-700 font-bold py-2 px-6 rounded transition-colors">
              無料で登録する
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
