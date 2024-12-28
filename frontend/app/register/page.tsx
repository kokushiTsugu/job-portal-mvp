// frontend/app/register/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    resumeUrl: "",
  });
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
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to register");
      }

      // ログイン状態を実現
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userResumeUrl", data.resumeUrl || "");

      setMessage("登録が完了しました！");
      router.push("/"); // トップページへ遷移
    } catch (error: any) {
      setMessage(`登録失敗: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">ユーザー登録</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-semibold text-gray-700 mb-2">
              名前
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="お名前"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-semibold text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded"
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
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="resumeUrl" className="block font-semibold text-gray-700 mb-2">
              履歴書のURL（任意）
            </label>
            <input
              type="text"
              name="resumeUrl"
              id="resumeUrl"
              className="w-full p-3 border border-gray-300 rounded"
              placeholder="履歴書を格納したURL"
              value={formData.resumeUrl}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded"
          >
            登録
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 font-semibold text-blue-800">{message}</p>
        )}

        <div className="text-center mt-6">
          <Link href="/login" className="text-blue-700 hover:underline font-medium">
            すでにアカウントがある場合はこちら
          </Link>
        </div>
      </div>
    </div>
  );
}
