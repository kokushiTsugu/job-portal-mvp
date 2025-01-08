"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl, getFetchOptions } from "@/lib/config";

interface Interview {
  _id: string;
  title: string;
  subtitle?: string;
  company?: string;
  category?: string;
  imageUrl?: string;
  postedAt?: string;
  content?: string;
  tags?: string[];
}

export default function InterviewDetailPage() {
  const params = useParams();
  const { id } = params;

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await fetch(getApiUrl(`interviews/${id}`), getFetchOptions());
        if (!res.ok) {
          throw new Error("インタビュー詳細の取得に失敗しました");
        }
        const data = await res.json();
        setInterview(data.interview);
      } catch (error: any) {
        console.error(error);
        setMessage("インタビュー詳細の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchInterview();
    }
  }, [id]);

  useEffect(() => {
    if (interview && interview.postedAt) {
      const date = new Date(interview.postedAt);
      setFormattedDate(date.toLocaleDateString());
    }
  }, [interview]);

  if (loading) return <div className="p-4 text-center">読み込み中...</div>;
  if (message) return <div className="p-4 text-center text-red-500">{message}</div>;

  if (!interview) {
    return (
      <div className="p-4 text-center text-red-500">
        インタビューが見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-tr from-pink-100 via-pink-50 to-pink-200">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        {interview.imageUrl && (
          <img src={interview.imageUrl} alt={interview.title} className="w-full h-auto object-cover rounded mb-6" />
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{interview.title}</h1>
        {interview.subtitle && <h2 className="text-xl text-gray-700 mb-4">{interview.subtitle}</h2>}
        {interview.company && <p className="text-md text-gray-500 mb-2 italic">by {interview.company}</p>}
        {interview.category && (
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full mb-4">
            {interview.category.toUpperCase()}
          </span>
        )}
        {formattedDate && (
          <p className="text-sm text-gray-400 mb-6">
            投稿日: {formattedDate}
          </p>
        )}
        {interview.content && (
          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed mb-6">
            {interview.content}
          </div>
        )}
        {interview.tags && interview.tags.length > 0 && (
          <div className="mb-4">
            <span className="text-sm text-gray-500 font-semibold">タグ:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {interview.tags.map((tag, index) => (
                <span key={index} className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        <Link href="/interviews">
          <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors">
            インタビュー一覧に戻る
          </button>
        </Link>
      </div>
    </div>
  );
}
