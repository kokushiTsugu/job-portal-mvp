/////////////////////////////////////////////
// frontend/app/mypage/gamification/page.tsx (改良版)
/////////////////////////////////////////////
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/config";

interface UserInfo {
  onChainLevel: number;
}

export default function GamificationMainPage() {
  const [onChainLevel, setOnChainLevel] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // 未ログインなら0のまま
    (async () => {
      try {
        const res = await fetch(getApiUrl("user/me"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return; // 失敗時そのまま
        const data = await res.json();
        setOnChainLevel(data.onChainLevel || 0);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">ブロックチェーン体験ミッション</h1>
        <p className="text-gray-700 mb-6">
          ここでは、ブロックチェーンを使った様々なタスクを段階的に学べます。<br/>
          まずは初級タスク「ウォレット接続」から始めてみましょう。
        </p>

        {/* 初級 */}
        <div className="mb-4 border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">初級: ウォレットを接続</h2>
          <p className="text-sm text-gray-600 mb-4">
            MetaMaskなどのウォレットを実際に接続し、サーバーと署名認証するタスクです。
          </p>
          {onChainLevel >= 1 ? (
            <div className="text-green-600 font-bold">▶︎ 完了済み</div>
          ) : (
            <Link
              href="/mypage/gamification/intro-l1"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              初級タスクをやってみる
            </Link>
          )}
        </div>

        {/* 中級 */}
        <div className="mb-4 border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">中級: テストネットで送金</h2>
          <p className="text-sm text-gray-600 mb-4">
            Rinkeby等でトークンを1回送金してみよう
          </p>
          {onChainLevel < 1 ? (
            <div className="text-gray-400">※ 初級が未完了のためロック中</div>
          ) : onChainLevel >= 2 ? (
            <div className="text-green-600 font-bold">▶︎ 完了済み</div>
          ) : (
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
              中級タスクをやってみる (詳細ページ未実装)
            </button>
          )}
        </div>

        {/* 上級 */}
        <div className="mb-4 border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">上級: NFTをMint</h2>
          <p className="text-sm text-gray-600 mb-4">
            テストネットで簡単なNFTをMintしてみよう
          </p>
          {onChainLevel < 2 ? (
            <div className="text-gray-400">※ 中級が未完了のためロック中</div>
          ) : onChainLevel >= 3 ? (
            <div className="text-green-600 font-bold">▶︎ 完了済み</div>
          ) : (
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
              上級タスクをやってみる (詳細ページ未実装)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
