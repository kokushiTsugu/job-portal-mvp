// frontend/app/login/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl } from "@/lib/config";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(getApiUrl("login"), {
        method: "POST",
        mode: 'cors',
        credentials: 'include',
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();
      console.log("Login response:", data); // デバッグ用

      if (!response.ok) {
        throw new Error(data.message || "Failed to login");
      }

      // ユーザー情報をlocalStorageに保存
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userResumeUrl", data.resumeUrl);

      setMessage("ログインに成功しました！");
      // router.push("/") の後にページを再読み込みしてlayout.tsxのuseEffectを再実行
      router.push("/");
      window.location.href = "/";
    } catch (error: any) {
      setMessage(`ログイン失敗: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">ログイン</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-semibold text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              placeholder="yourname@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-semibold text-gray-700 mb-2">
              パスワード
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded transition duration-200"
          >
            ログイン
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 font-semibold text-purple-800">{message}</p>
        )}

        <div className="text-center mt-6">
          <Link href="/register" className="text-purple-700 hover:underline font-medium">
            アカウントがない場合は登録はこちら
          </Link>
        </div>
      </div>
    </div>
  );
}
