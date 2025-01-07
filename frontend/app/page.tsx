"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Welcome to Job Portal
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Find your next career opportunity with us. Browse through hundreds of job listings from top companies.
        </p>
        <Link href="/jobs">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
            Browse Jobs
          </button>
        </Link>
      </div>
    </div>
  );
}
