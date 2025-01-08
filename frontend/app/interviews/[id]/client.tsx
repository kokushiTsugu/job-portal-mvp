"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl } from "@/lib/config";

interface Interview {
  id: string;
  jobId: string;
  status: string;
  scheduledTime: string;
  feedback?: string;
}

export default function InterviewDetailClient() {
  const params = useParams();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mockInterview = {
      id: params.id as string,
      jobId: "1",
      status: "scheduled",
      scheduledTime: "2024-03-15T10:00:00Z",
      feedback: "Great interview! The candidate showed strong technical skills."
    };
    
    setInterview(mockInterview);
    setLoading(false);
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!interview) return <div>Interview not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Interview Details</h1>
        <div className="mb-4">
          <p className="text-gray-600">Interview ID: {interview.id}</p>
          <p className="text-gray-600">Job ID: {interview.jobId}</p>
          <p className="text-gray-600">Status: {interview.status}</p>
          <p className="text-gray-600">Scheduled Time: {interview.scheduledTime}</p>
          {interview.feedback && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Feedback</h2>
              <p className="text-gray-700">{interview.feedback}</p>
            </div>
          )}
        </div>
        <div className="mt-6">
          <Link href={`/jobs/${interview.jobId}`} className="text-blue-500 hover:text-blue-700">
            View Job Details
          </Link>
        </div>
      </div>
    </div>
  );
}
