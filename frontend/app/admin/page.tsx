"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("メールアドレスとパスワードを入力してください。");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        throw new Error("ログインに失敗しました。");
      }

      const data = await res.json();
      // ログイン成功時にトークンをlocalStorageに保存
      localStorage.setItem("adminToken", data.token);

      // ダッシュボードへ遷移
      router.push("/admin/dashboard");
    } catch (error: any) {
      setErrorMessage(error.message || "ログイン中にエラーが発生しました。");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-900">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">管理者ログイン</h1>
        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:border-indigo-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:border-indigo-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded transition-colors"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
}
