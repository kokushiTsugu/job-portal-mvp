/////////////////////////////////////////////
// frontend/app/mypage/page.tsx (修正版)
/////////////////////////////////////////////
"use client";

import React, { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/config";

export default function MyPage() {
  const [userName, setUserName] = useState("");
  const [onChainLevel, setOnChainLevel] = useState(0);
  const [badgeLabel, setBadgeLabel] = useState("未経験");

  useEffect(() => {
    const nameFromStorage = localStorage.getItem("userName") || "";
    setUserName(nameFromStorage);

    const token = localStorage.getItem("token");
    if (!token) return; // 未ログイン

    (async () => {
      try {
        const res = await fetch(getApiUrl("user/me"), {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          console.warn("Failed to fetch /user/me");
          return;
        }
        const data = await res.json();
        setOnChainLevel(data.onChainLevel || 0);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    let label = "未経験";
    if (onChainLevel === 1) label = "初級";
    else if (onChainLevel === 2) label = "中級";
    else if (onChainLevel === 3) label = "上級";
    else if (onChainLevel >= 4) label = "マスター";
    setBadgeLabel(label);
  }, [onChainLevel]);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">マイページ</h1>
      <p className="mb-4">こんにちは、{userName}さん</p>

      <div className="flex items-center space-x-2 mb-2">
        <span className="font-semibold">オンチェーン経験:</span>
        <span className="px-3 py-1 bg-green-500 text-white rounded-full">
          {badgeLabel}
        </span>
      </div>
      <p className="text-sm text-gray-500">onChainLevel: {onChainLevel}</p>
    </div>
  );
}
