/////////////////////////////////////////////
// frontend/app/mypage/applications/page.tsx (修正版)
/////////////////////////////////////////////
"use client";

import React, { useEffect, useState } from "react";

interface Application {
  _id: string;
  jobTitle?: string;
  status?: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        const res = await fetch("http://localhost:8080/applications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          throw new Error("応募一覧の取得に失敗しました");
        }
        const data = await res.json();
        // dataが配列かどうかチェック (サーバーが配列を返していればOK)
        if (!Array.isArray(data)) {
          console.error("Expected an array for applications, got:", data);
          return;
        }
        setApplications(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">応募履歴</h1>
      {applications.length === 0 ? (
        <p>応募がありません。</p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app._id} className="border p-3">
              <h2 className="font-semibold">{app.jobTitle || "No Title"}</h2>
              <p className="text-sm text-gray-600">{app.status || "未定"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
