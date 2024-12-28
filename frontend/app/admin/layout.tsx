/////////////////////////////////////////////
// frontend/app/admin/layout.tsx
/////////////////////////////////////////////
"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 上部バー */}
      <header className="bg-indigo-700 text-white px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">管理画面</div>
        <button
          onClick={handleLogout}
          className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded"
        >
          ログアウト
        </button>
      </header>

      <div className="flex flex-1">
        {/* サイドバー */}
        <aside className="w-60 bg-gray-100 p-4">
          <nav className="space-y-2">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className={`block w-full text-left px-3 py-2 rounded ${
                pathname === "/admin/dashboard" ? "bg-gray-300" : ""
              }`}
            >
              ダッシュボード
            </button>
            <button
              onClick={() => router.push("/admin/jobs")}
              className={`block w-full text-left px-3 py-2 rounded ${
                pathname?.startsWith("/admin/jobs") ? "bg-gray-300" : ""
              }`}
            >
              求人管理
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-6 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
