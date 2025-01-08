"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { getApiUrl } from "@/lib/config";

interface User {
  name: string;
  email: string;
  resumeUrl?: string;
  telegramId?: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export default function ProfileEditPage() {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    resumeUrl: "",
    telegramId: "",
    phone: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: ""
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const userResumeUrl = localStorage.getItem("userResumeUrl");

    if (!token) {
      setMessage("ログインが必要です。");
      return;
    }

    setUser((prev) => ({
      ...prev,
      name: userName || "",
      email: userEmail || "",
      resumeUrl: userResumeUrl || ""
    }));
  }, []);

  const optionalFields = ["resumeUrl", "telegramId", "phone", "linkedinUrl", "githubUrl", "portfolioUrl"];
  const filledCount = optionalFields.reduce((count, field) => {
    const value = (user as any)[field];
    return value && value.trim() !== "" ? count + 1 : count;
  }, 0);
  const totalOptional = optionalFields.length;
  const completionRate = Math.round((filledCount / totalOptional) * 100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("ログインが必要です。");
      return;
    }

    try {
      const response = await fetch(getApiUrl("user"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "ユーザー情報更新に失敗しました");
      }

      setMessage("ユーザー情報が更新されました！");
      localStorage.setItem("userName", data.data.name);
      localStorage.setItem("userEmail", data.data.email || "");
      localStorage.setItem("userResumeUrl", data.data.resumeUrl || "");
    } catch (error: any) {
      setMessage(`エラー: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">プロフィール編集</h1>
        {message && (
          <p className="text-center text-red-500 mb-4">{message}</p>
        )}
        <p className="mb-4 font-semibold text-gray-700">プロフィール充実度: {completionRate}%</p>
        <div className="w-full bg-gray-300 rounded-full h-4 mb-6">
          <div className="bg-green-500 h-4 rounded-full" style={{width: `${completionRate}%`}}></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold" htmlFor="name">名前</label>
            <input
              type="text"
              name="name"
              id="name"
              className="w-full p-2 border border-gray-300 rounded"
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="email">メールアドレス</label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="resumeUrl">履歴書URL</label>
            <input
              type="text"
              name="resumeUrl"
              id="resumeUrl"
              className="w-full p-2 border border-gray-300 rounded"
              value={user.resumeUrl || ""}
              onChange={handleChange}
              placeholder="https://example.com/resume.pdf"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="telegramId">Telegram ID</label>
            <input
              type="text"
              name="telegramId"
              id="telegramId"
              className="w-full p-2 border border-gray-300 rounded"
              value={user.telegramId || ""}
              onChange={handleChange}
              placeholder="@your_telegram_id"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="phone">電話番号</label>
            <input
              type="text"
              name="phone"
              id="phone"
              className="w-full p-2 border border-gray-300 rounded"
              value={user.phone || ""}
              onChange={handleChange}
              placeholder="090-XXXX-XXXX"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="linkedinUrl">LinkedIn URL</label>
            <input
              type="url"
              name="linkedinUrl"
              id="linkedinUrl"
              className="w-full p-2 border border-gray-300 rounded"
              value={user.linkedinUrl || ""}
              onChange={handleChange}
              placeholder="https://www.linkedin.com/in/your-profile"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="githubUrl">GitHub URL</label>
            <input
              type="url"
              name="githubUrl"
              id="githubUrl"
              className="w-full p-2 border border-gray-300 rounded"
              value={user.githubUrl || ""}
              onChange={handleChange}
              placeholder="https://github.com/yourname"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="portfolioUrl">ポートフォリオURL</label>
            <input
              type="url"
              name="portfolioUrl"
              id="portfolioUrl"
              className="w-full p-2 border border-gray-300 rounded"
              value={user.portfolioUrl || ""}
              onChange={handleChange}
              placeholder="https://your-portfolio.com"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded mt-4"
          >
            更新
          </button>
        </form>
      </div>
    </div>
  );
}
