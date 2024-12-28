/////////////////////////////////////////////
// frontend/app/mypage/gamification/intro-l1/page.tsx (修正版)
/////////////////////////////////////////////
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

export default function IntroL1Page() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");

  const handleAllInOne = async () => {
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("ログインが必要です。");
      }

      if (!window.ethereum) {
        throw new Error("MetaMaskが見つかりません。");
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);

      // request-challenge
      const challengeRes = await fetch("http://localhost:8080/web3/request-challenge", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!challengeRes.ok) {
        const errData = await challengeRes.json();
        throw new Error(errData.message || "チャレンジ取得失敗");
      }
      const { challenge } = await challengeRes.json();

      // 署名
      const signature = await signer.signMessage(challenge);

      // verify
      const verifyRes = await fetch("http://localhost:8080/web3/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ address: addr, signature })
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.message || "verifyエラー");
      }

      setMessage(`成功: ${verifyData.message}\nレベル:${verifyData.onChainLevel}\n完了タスク:${verifyData.completedTasks.join(", ")}`);

      // ★ ここでマイページへ戻る
      // router.push("/mypage");
    } catch (err: any) {
      setMessage(`エラー: ${err.message}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">初級タスク: ウォレット接続 (一気に署名)</h1>
      {message && <p className="mb-4 whitespace-pre-line">{message}</p>}
      {address && <p className="mb-4 text-sm">あなたのウォレットアドレス: {address}</p>}

      <button
        onClick={handleAllInOne}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        メタマスクを連携して署名
      </button>
    </div>
  );
}
