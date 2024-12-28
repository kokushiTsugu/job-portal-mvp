"use client";

import React from 'react';
import Link from 'next/link';

interface NavbarProps {
  user: { name: string } | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="bg-white shadow flex justify-between items-center px-6 py-4">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          JobPortal
        </Link>
        <Link href="/jobs" className="text-gray-700 hover:text-gray-900 font-medium">
          ジョブ一覧
        </Link>
        {user && (
          <Link href="/mypage" className="text-gray-700 hover:text-gray-900 font-medium">
            マイページ
          </Link>
        )}
        <Link href="/interviews" className="text-gray-700 hover:text-gray-900 font-medium">
          インタビュー
        </Link>
      </div>
      <div>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">ようこそ、{user.name}さん</span>
            <button onClick={onLogout} className="text-blue-600 hover:underline font-medium">
              ログアウト
            </button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              ログイン
            </Link>
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              登録
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
