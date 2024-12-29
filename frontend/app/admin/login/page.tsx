/////////////////////////////////////////////
// frontend/app/admin/login/page.tsx (修正版)
/////////////////////////////////////////////
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("http://localhost:8080/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "管理者ログインに失敗");
      }

      // 成功 → tokenをlocalStorageへ
      localStorage.setItem("adminToken", data.token || "");

      // 名前が返ってきたら保存。無い場合は "管理者" 固定
      localStorage.setItem("adminName", data.name || "管理者");

      // roleがadminかどうかチェックし、adminならダッシュボード
      if (data.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        // roleがadminでない場合 → 例えばmypageへ誘導？
        router.push("/mypage");
      }

    } catch (error: any) {
      setMsg("エラー: " + error.message);
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">管理者ログイン</h1>
        {msg && <p className="text-red-500 mb-3">{msg}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">メールアドレス</label>
            <input
              type="email"
              className="w-full border p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">パスワード</label>
            <input
              type="password"
              className="w-full border p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
}
