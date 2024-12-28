// frontend/app/components/JobCard.tsx

"use client";

import React from 'react';
import Link from 'next/link'; // Linkをimport

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  estimatedSalary: number;
  employmentType: string;
  featured: boolean;
  jobType: string;
  workplace: string;
  imageUrl?: string;
}

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transform transition-transform hover:scale-[1.02] hover:shadow-md">
      <div className="bg-gray-100 h-40 w-full flex items-center justify-center overflow-hidden">
        {job.imageUrl ? (
          <img 
            src={job.imageUrl} 
            alt={job.title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>

      <div className="p-4 space-y-2">
        {job.featured && (
          <div className="inline-block bg-pink-100 text-pink-700 text-xs font-semibold px-2 py-1 rounded-full">
            FEATURED
          </div>
        )}
        
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2 leading-tight">
          {job.title}
        </h3>

        <p className="text-sm text-gray-600">{job.company}</p>
        <p className="text-sm text-gray-600">場所: {job.location}</p>
        <p className="text-sm text-gray-600">想定年収: {job.estimatedSalary.toLocaleString()}円</p>
        <p className="text-sm text-gray-600">雇用形態: {job.employmentType}</p>
        <p className="text-sm text-gray-600">職種カテゴリ: {job.jobType}</p>
        <p className="text-sm text-gray-600">働き方: {job.workplace}</p>

        <div className="pt-2">
          {/* Linkを使用して、/jobs/ジョブIDへ遷移 */}
          <Link href={`/jobs/${job._id}`}>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors">
              詳細を見る
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
