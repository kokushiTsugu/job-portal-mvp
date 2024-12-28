/////////////////////////////////////////////
// frontend/app/admin/register/page.tsx
/////////////////////////////////////////////
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("http://localhost:8080/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "管理者登録に失敗しました。");
      }

      // 成功 → tokenをlocalStorageへ
      if (data.token) {
        localStorage.setItem("adminToken", data.token);
      }

      // role が admin なら adminダッシュボードへ
      if (data.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        // 通常ユーザーだったらどうする？ → ここは想定外なので例外的にmypageへ？
        router.push("/mypage");
      }

    } catch (error: any) {
      setMsg("エラー: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-900">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">管理者登録</h1>
        {msg && <p className="text-red-500 text-sm mb-4">{msg}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              管理者名 (任意)
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="太郎 管理者"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded"
          >
            登録
          </button>
        </form>
      </div>
    </div>
  );
}
