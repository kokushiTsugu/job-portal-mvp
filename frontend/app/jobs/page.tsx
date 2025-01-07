"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/config";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  imageUrl?: string;
  estimatedSalary?: number; // 追加
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(getApiUrl("jobs"), {
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });
        if (!res.ok) throw new Error("Jobs fetch failed");
        const data = await res.json();
        const fetchedJobs: Job[] = data.jobs || [];
        setJobs(fetchedJobs);
        setFilteredJobs(fetchedJobs);
      } catch (err) {
        console.error(err);
        setMessage("ジョブ取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // 検索機能
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredJobs(jobs);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = jobs.filter((job) =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query)
      );
      setFilteredJobs(filtered);
    }
  }, [searchQuery, jobs]);

  if (loading) return <div className="text-center py-10">読み込み中...</div>;
  if (message) return <div className="text-center py-10 text-red-500">{message}</div>;

  const positionCount = filteredJobs.length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">ジョブ一覧</h1>

        {/* 検索バー */}
        <div className="mb-6 flex items-center space-x-2">
          <input
            type="text"
            placeholder="ポジション名や企業名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-white border border-gray-300 rounded-lg py-2 px-4 text-gray-800 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded transition-colors"
            >
              クリア
            </button>
          )}
        </div>

        {/* 公開中のポジション数 */}
        <div className="mb-4 flex items-center space-x-2">
          <span className="inline-block text-gray-700 text-sm font-medium">公開中のポジション：</span>
          <span className="text-base font-semibold text-gray-800">{positionCount}件</span>
        </div>

        {filteredJobs.length === 0 ? (
          <p className="text-center text-gray-700">該当するポジションがありません。</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
                {/* 画像表示 */}
                {job.imageUrl && (
                  <img src={job.imageUrl} alt={job.title} className="w-full h-48 object-cover rounded-md mb-4" />
                )}
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{job.title}</h2>
                <p className="text-sm text-gray-500 mb-1">
                  {job.company} | {job.location}
                </p>
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
        )}
      </div>
    </div>
  );
}
