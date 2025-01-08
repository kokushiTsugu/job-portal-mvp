/////////////////////////////////////////////
// frontend/app/admin/dashboard/page.tsx
/////////////////////////////////////////////
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from "@/lib/config";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    jobsCount: 0,
    applicationsCount: 0,
    scoutReplyRate: "0%",
    totalUsers: 0,
    activeUsers: 0,
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      router.replace("/admin/login");
      return;
    }

    fetch(getApiUrl("admin/stats"), {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Stats API error");
        }
        return res.json();
      })
      .then((data) => {
        setStats({
          jobsCount: data.jobsCount ?? 0,
          applicationsCount: data.applicationsCount ?? 0,
          scoutReplyRate: data.scoutReplyRate ?? "0%",
          totalUsers: data.totalUsers ?? 0,
          activeUsers: data.activeUsers ?? 0,
        });
      })
      .catch((err) => {
        console.error("統計データの取得に失敗:", err);
        setErrorMessage("統計データの取得に失敗: " + err.message);
      });
  }, [router]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">管理ダッシュボード</h1>
      {errorMessage && (
        <p className="text-red-600 font-semibold">{errorMessage}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 企業KPI */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800">公開中の求人</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {stats.jobsCount}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800">応募総数</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {stats.applicationsCount}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800">スカウト返信率</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {stats.scoutReplyRate}
          </p>
        </div>

        {/* 求職者KPI */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800">登録ユーザー数</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {stats.totalUsers}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800">アクティブユーザー</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {stats.activeUsers}
          </p>
        </div>
      </div>
    </div>
  );
}
