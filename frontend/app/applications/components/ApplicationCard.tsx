// frontend/app/mypage/applications/components/ApplicationCard.tsx

"use client";

import React from "react";

interface Application {
  _id: string;
  jobId: {
    title?: string;
    company?: string;
    category?: string;
    location?: string;
  } | null;
  name: string;
  email: string;
  resume: string;
  appliedAt: string;
  status: string;
}

export default function ApplicationCard({ application }: { application: Application }) {
  const job = application.jobId;
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">
        {job?.title ?? "ジョブ情報がありません"}
      </h2>
      <p className="text-gray-600 mb-1">会社名: {job?.company ?? "不明"}</p>
      <p className="text-gray-600 mb-1">カテゴリ: {job?.category ?? "不明"}</p>
      <p className="text-gray-600 mb-1">勤務地: {job?.location ?? "不明"}</p>
      <p className="text-gray-600 mb-1">応募日: {new Date(application.appliedAt).toLocaleDateString()}</p>
      <p className="text-gray-600">ステータス: {application.status}</p>
    </div>
  );
}
