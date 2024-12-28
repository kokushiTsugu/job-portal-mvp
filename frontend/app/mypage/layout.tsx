/////////////////////////////////////////////
// frontend/app/mypage/layout.tsx
/////////////////////////////////////////////
import React from "react";
import Link from "next/link";

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 上部ヘッダー */}
      <header className="bg-white shadow p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">マイページ</h1>
          {/* 右側に何か表示したければ */}
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex">
        {/* 左側サイドメニュー */}
        <nav className="w-64 p-4 bg-white shadow h-screen sticky top-0">
          <ul className="space-y-3">
            <li>
              <Link href="/mypage" className="block text-blue-600 hover:underline">
                マイページトップ
              </Link>
            </li>
            <li>
              <Link href="/mypage/profile" className="block text-blue-600 hover:underline">
                プロフィール編集
              </Link>
            </li>
            <li>
              <Link href="/mypage/applications" className="block text-blue-600 hover:underline">
                応募履歴
              </Link>
            </li>
            <li>
              <Link href="/mypage/gamification" className="block text-blue-600 hover:underline">
                ブロックチェーン体験
              </Link>
            </li>
          </ul>
        </nav>

        {/* メインコンテンツ領域 */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
