"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InterviewCard({ interview }) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (interview.postedAt) {
      const date = new Date(interview.postedAt);
      setFormattedDate(date.toLocaleDateString());
    }
  }, [interview.postedAt]);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
      {interview.imageUrl && (
        <img src={interview.imageUrl} alt={interview.title} className="w-full h-48 object-cover rounded-md mb-4" />
      )}
      <h2 className="text-xl font-semibold mb-2">{interview.title}</h2>
      {interview.subtitle && <p className="text-gray-600 mb-2">{interview.subtitle}</p>}
      {interview.company && <p className="text-sm text-gray-500 italic mb-2">by {interview.company}</p>}
      {interview.category && (
        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full mb-2">
          {interview.category.toUpperCase()}
        </span>
      )}
      {formattedDate && <p className="text-xs text-gray-400 mb-4">投稿日: {formattedDate}</p>}
      <Link href={`/interviews/${interview._id}`}>
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded transition-colors">
          詳細を見る
        </button>
      </Link>
    </div>
  );
}
