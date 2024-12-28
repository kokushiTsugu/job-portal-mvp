"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../styles/globals.css";
import {
  FiMenu,
  FiX,
  FiUser,
  FiBell,
  FiHome,
  FiLogOut,
  FiBookOpen,
  FiEdit,
} from "react-icons/fi";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 「お知らせ」パネルを開閉するためのステート
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // ▼ 一般ユーザー
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(""); // ようこそ xxx さん

  // ▼ 管理者
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 一般ユーザーログイン判定
      const userToken = localStorage.getItem("token");
      const savedName = localStorage.getItem("userName");

      if (userToken) {
        setIsLoggedIn(true);
        if (savedName) setUserName(savedName);
      } else {
        setIsLoggedIn(false);
        setUserName("");
      }

      // 管理者ログイン判定
      const adminToken = localStorage.getItem("adminToken");
      const savedAdminName = localStorage.getItem("adminName");
      if (adminToken) {
        setIsAdminLoggedIn(true);
        if (savedAdminName) {
          setAdminName(savedAdminName);
        } else {
          setAdminName("管理者");
        }
      } else {
        setIsAdminLoggedIn(false);
        setAdminName("");
      }
    }
  }, []);

  // ▼ ハンバーガーメニュー
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // ▼ お知らせパネル
  const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);
  const closeNotification = () => setIsNotificationOpen(false);

  // ▼ ログアウト処理
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      // 一般ユーザー＆管理者のトークンを両方消すかは運用による
      // ここではまとめて削除
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminName");

      setIsLoggedIn(false);
      setUserName("");
      setIsAdminLoggedIn(false);
      setAdminName("");
    }
    closeMenu();
  };

  return (
    <html lang="ja">
      <body className="min-h-screen bg-gradient-to-r from-pink-100 via-pink-200 to-pink-300 font-sans text-gray-800">
        {/* ▼ Header */}
        <header className="bg-white shadow-sm relative">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            {/* 左: ロゴ - クリック時にトップ遷移 */}
            <Link href="/" className="flex items-center" onClick={closeMenu}>
              <img
                src="/images/TSUGU_logo_draft.png"
                alt="Company Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="text-2xl font-bold text-indigo-800">TSUGU</span>
            </Link>

            {/* 右: メニュー */}
            <div className="flex items-center space-x-4">
              {/* ようこそxxxさん */}
              {isAdminLoggedIn ? (
                /* 管理者ログイン中 */
                <div className="text-sm text-gray-600 hidden sm:block">
                  ようこそ <span className="font-semibold">{adminName}</span> さん
                </div>
              ) : (
                /* 一般ユーザーログインの場合 */
                isLoggedIn &&
                userName && (
                  <div className="text-sm text-gray-600 hidden sm:block">
                    ようこそ <span className="font-semibold">{userName}</span> さん
                  </div>
                )
              )}

              {/* メインメニュー部分：ログイン前/後で分岐 + 管理者かどうか */}
              {/* 管理者がログインしているとき */}
              {isAdminLoggedIn ? (
                <>
                  <Link
                    href="/admin/dashboard"
                    className="hover:text-indigo-600 transition-colors"
                    onClick={closeMenu}
                  >
                    管理ダッシュボード
                  </Link>
                  <Link
                    href="/admin/jobs"
                    className="hover:text-indigo-600 transition-colors"
                    onClick={closeMenu}
                  >
                    求人管理
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hover:text-red-600 transition-colors"
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  {/* (A) 一般ユーザーがログインしている場合 */}
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/mypage"
                        className="hover:text-indigo-600 transition-colors hidden sm:block"
                        onClick={closeMenu}
                      >
                        マイページ
                      </Link>
                      <button
                        onClick={toggleNotification}
                        className="hover:text-indigo-600 transition-colors hidden sm:block"
                      >
                        お知らせ
                      </button>
                      <button
                        onClick={handleLogout}
                        className="hover:text-red-600 transition-colors"
                      >
                        ログアウト
                      </button>
                    </>
                  ) : (
                    <>
                      {/* (B) 未ログイン時 */}
                      <Link
                        href="/login"
                        className="hover:text-indigo-600 transition-colors"
                        onClick={closeMenu}
                      >
                        ログイン
                      </Link>
                      <Link
                        href="/register"
                        className="hover:text-indigo-600 transition-colors"
                        onClick={closeMenu}
                      >
                        会員登録
                      </Link>
                    </>
                  )}
                </>
              )}

              {/* ハンバーガーボタン */}
              <button
                onClick={toggleMenu}
                className="text-2xl text-indigo-800 focus:outline-none"
              >
                <FiMenu />
              </button>
            </div>
          </div>

          {/* ▼ ハンバーガーメニュー (全体を覆う形) */}
          {isMenuOpen && (
            <div className="fixed top-0 left-0 w-full bg-white z-50">
              {/* メニュー上部: ロゴ + 閉じるボタン */}
              <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between border-b">
                <Link
                  href="/"
                  className="flex items-center"
                  onClick={() => {
                    closeMenu();
                    closeNotification();
                  }}
                >
                  <img
                    src="/images/TSUGU_logo_draft.png"
                    alt="Company Logo"
                    width={40}
                    height={40}
                    className="mr-2"
                  />
                  <span className="text-2xl font-bold text-indigo-800">TSUGU</span>
                </Link>
                <button onClick={toggleMenu} className="text-2xl text-indigo-800">
                  <FiX />
                </button>
              </div>

              {/* メニュー内容 */}
              <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row">
                {/* 左: MENUセクション */}
                <div className="flex-1 mb-8 lg:mb-0 lg:mr-8">
                  <h2 className="text-gray-500 text-sm uppercase mb-4">Menu</h2>
                  <ul className="space-y-3 text-lg">
                    {/* ホーム */}
                    <li>
                      <Link
                        href="/"
                        className="flex items-center hover:text-indigo-600"
                        onClick={closeMenu}
                      >
                        <FiHome className="mr-2" />
                        ホーム
                      </Link>
                    </li>

                    {/* ▼ 管理者ログイン時のメニュー */}
                    {isAdminLoggedIn && (
                      <>
                        <li>
                          <Link
                            href="/admin/dashboard"
                            className="flex items-center hover:text-indigo-600"
                            onClick={closeMenu}
                          >
                            <FiUser className="mr-2" />
                            管理ダッシュボード
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/admin/jobs"
                            className="flex items-center hover:text-indigo-600"
                            onClick={closeMenu}
                          >
                            <FiBookOpen className="mr-2" />
                            求人管理
                          </Link>
                        </li>
                      </>
                    )}

                    {/* ▼ 一般ユーザー未ログイン */}
                    {!isLoggedIn && !isAdminLoggedIn && (
                      <>
                        <li>
                          <Link
                            href="/login"
                            className="flex items-center hover:text-indigo-600"
                            onClick={closeMenu}
                          >
                            <FiUser className="mr-2" />
                            ログイン
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/register"
                            className="flex items-center hover:text-indigo-600"
                            onClick={closeMenu}
                          >
                            <FiEdit className="mr-2" />
                            会員登録
                          </Link>
                        </li>
                      </>
                    )}

                    {/* ▼ 一般ユーザーがログイン中 */}
                    {isLoggedIn && !isAdminLoggedIn && (
                      <>
                        <li>
                          <Link
                            href="/mypage"
                            className="flex items-center hover:text-indigo-600"
                            onClick={closeMenu}
                          >
                            <FiUser className="mr-2" />
                            マイページ
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              toggleNotification();
                              closeMenu();
                            }}
                            className="flex items-center hover:text-indigo-600"
                          >
                            <FiBell className="mr-2" />
                            お知らせ
                          </button>
                        </li>
                      </>
                    )}

                    {/* インタビュー */}
                    <li>
                      <Link
                        href="/interviews"
                        className="flex items-center hover:text-indigo-600"
                        onClick={closeMenu}
                      >
                        <FiBookOpen className="mr-2" />
                        インタビュー
                      </Link>
                    </li>

                    {/* ジョブ一覧 */}
                    <li>
                      <Link
                        href="/jobs"
                        className="flex items-center hover:text-indigo-600"
                        onClick={closeMenu}
                      >
                        <FiBookOpen className="mr-2" />
                        ジョブ一覧
                      </Link>
                    </li>

                    {/* もしガイドがあれば */}
                    <li>
                      <Link
                        href="/guide"
                        className="flex items-center hover:text-indigo-600"
                        onClick={closeMenu}
                      >
                        <FiBookOpen className="mr-2" />
                        初めての方へ
                      </Link>
                    </li>

                    {/* ログアウトボタン (ユーザー or 管理者の両方を落とす) */}
                    {(isLoggedIn || isAdminLoggedIn) && (
                      <li>
                        <button
                          onClick={handleLogout}
                          className="flex items-center hover:text-red-600 transition-colors"
                        >
                          <FiLogOut className="mr-2" />
                          ログアウト
                        </button>
                      </li>
                    )}
                  </ul>
                </div>

                {/* 右: SEARCHセクション (例) */}
                <div className="flex-1">
                  <h2 className="text-gray-500 text-sm uppercase mb-4">Search</h2>
                  <ul className="space-y-3 text-lg">
                    <li>
                      <Link href="#" className="hover:text-indigo-600" onClick={closeMenu}>
                        職種で探す
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-indigo-600" onClick={closeMenu}>
                        業界で探す
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-indigo-600" onClick={closeMenu}>
                        勤務地で探す
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="hover:text-indigo-600" onClick={closeMenu}>
                        年収で探す
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ▼ お知らせパネル (画面上部にオーバーレイ) */}
          {isNotificationOpen && (
            <div className="fixed top-0 left-0 w-full bg-white z-50">
              {/* 上部: タイトル + 閉じるボタン */}
              <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between border-b">
                <h2 className="text-xl font-bold text-indigo-800">お知らせ</h2>
                <button
                  onClick={closeNotification}
                  className="text-2xl text-indigo-800 focus:outline-none"
                >
                  <FiX />
                </button>
              </div>

              {/* 本文部分 (仮: テキストやリスト) */}
              <div className="max-w-6xl mx-auto px-4 py-6">
                <p className="mb-4">
                  こちらにお知らせ内容を表示します。例えばシステムメンテナンス情報など。
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>メンテナンス予定: 6/25 1:00 - 3:00</li>
                  <li>新しい求人が追加されました</li>
                  <li>UI改善のお知らせ</li>
                </ul>
              </div>
            </div>
          )}
        </header>
        {/* ▲ Header End */}

        {/* ▼ Main Content */}
        <main className="max-w-7xl mx-auto p-4">{children}</main>
        {/* ▲ Main Content */}
      </body>
    </html>
  );
}
