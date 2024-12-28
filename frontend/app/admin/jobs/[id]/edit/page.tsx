/////////////////////////////////////////////
// frontend/app/admin/jobs/[id]/edit/page.tsx
/////////////////////////////////////////////
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function JobEditPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("published");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ジョブ情報取得
    const fetchJob = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");
        if (!adminToken) {
          router.replace("/admin/login");
          return;
        }
        const res = await fetch(`http://localhost:8080/admin/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (!res.ok) throw new Error("求人情報取得に失敗");
        const data = await res.json();
        setTitle(data.job.title);
        setDescription(data.job.description || "");
        setStatus(data.job.status || "published");
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJob();
  }, [jobId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) return;
      const res = await fetch(`http://localhost:8080/admin/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, status }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "求人更新に失敗");
      }
      router.push("/admin/jobs");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>読み込み中...</div>;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">求人編集</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">タイトル</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">説明</label>
          <textarea
            className="border p-2 w-full"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">ステータス</label>
          <select
            className="border p-2 w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="published">公開</option>
            <option value="draft">下書き</option>
            <option value="closed">終了</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          更新
        </button>
      </form>
    </div>
  );
}
