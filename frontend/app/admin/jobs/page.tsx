/////////////////////////////////////////////
// frontend/app/admin/jobs/page.tsx
/////////////////////////////////////////////
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Job {
  _id: string;
  title: string;
  description: string;
  status: string;
  company?: string;
  applicationCount?: number;
}

export default function AdminJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobDesc, setNewJobDesc] = useState("");
  const [newJobCompany, setNewJobCompany] = useState("");
  const [newJobStatus, setNewJobStatus] = useState("published");

  const fetchJobs = async () => {
    setErrorMessage("");
    try {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        router.replace("/admin/login");
        return;
      }
      const res = await fetch("http://localhost:8080/admin/jobs", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "求人リスト取得失敗");
      }
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Error: " + err.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) return;

      const res = await fetch("http://localhost:8080/admin/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          title: newJobTitle,
          description: newJobDesc,
          status: newJobStatus,
          company: newJobCompany,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "求人作成に失敗しました");
      }

      // 成功 → モーダル閉じる＆リセット
      setNewJobTitle("");
      setNewJobDesc("");
      setNewJobCompany("");
      setNewJobStatus("published");
      setShowModal(false);

      // 再取得
      fetchJobs();
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Error: " + err.message);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    setErrorMessage("");
    if (!confirm("本当に削除しますか？")) return;
    try {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) return;

      const res = await fetch(`http://localhost:8080/admin/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "求人削除に失敗しました");
      }
      fetchJobs();
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Error: " + err.message);
    }
  };

  const handleEditJob = (jobId: string) => {
    // 別ページで編集する場合はここで router.push(`/admin/jobs/${jobId}/edit`)
    // モーダルで編集するなら別UIを用意
    router.push(`/admin/jobs/${jobId}/edit`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">求人管理</h1>

      {errorMessage && (
        <p className="text-red-600 font-semibold">{errorMessage}</p>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded shadow"
      >
        新規求人を追加
      </button>

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full mt-4 border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="p-2 border-r border-gray-300">タイトル</th>
              <th className="p-2 border-r border-gray-300">会社名</th>
              <th className="p-2 border-r border-gray-300">ステータス</th>
              <th className="p-2 border-r border-gray-300">応募数</th>
              <th className="p-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="border-b border-gray-200">
                <td className="p-2 border-r border-gray-300">{job.title}</td>
                <td className="p-2 border-r border-gray-300">
                  {job.company || "（未入力）"}
                </td>
                <td className="p-2 border-r border-gray-300">{job.status}</td>
                <td className="p-2 border-r border-gray-300">
                  {job.applicationCount ?? 0}
                </td>
                <td className="p-2 whitespace-nowrap">
                  <button
                    onClick={() => handleEditJob(job._id)}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="text-red-600 hover:underline"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  求人がありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 新規求人作成モーダル */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow w-96 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 font-bold"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">求人を新規作成</h2>
            <form onSubmit={handleCreateJob} className="space-y-3">
              <div>
                <label className="block mb-1">タイトル</label>
                <input
                  type="text"
                  className="w-full border p-2"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">会社名</label>
                <input
                  type="text"
                  className="w-full border p-2"
                  value={newJobCompany}
                  onChange={(e) => setNewJobCompany(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">ステータス</label>
                <select
                  className="w-full border p-2"
                  value={newJobStatus}
                  onChange={(e) => setNewJobStatus(e.target.value)}
                >
                  <option value="published">published</option>
                  <option value="draft">draft</option>
                  <option value="closed">closed</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">説明</label>
                <textarea
                  className="w-full border p-2"
                  rows={3}
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  作成
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
