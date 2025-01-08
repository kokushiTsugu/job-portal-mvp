"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BriefcaseIcon, MapPinIcon, CurrencyYenIcon } from '@heroicons/react/24/solid';

export default function JobDetailClient() {
  const params = useParams();
  const [job, setJob] = useState(null);

  const mockJob = {
    id: params.id,
    title: "Software Engineer",
    company: "Tech Corp",
    location: "Tokyo, Japan",
    salary: "¥5,000,000 - ¥8,000,000",
    description: "We are looking for a talented software engineer...",
    requirements: [
      "5+ years of experience in software development",
      "Strong knowledge of JavaScript and React",
      "Experience with Node.js and Express",
    ],
  };

  useEffect(() => {
    setJob(mockJob);
  }, [params.id]);

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
        <div className="flex items-center mb-4">
          <BriefcaseIcon className="h-5 w-5 text-gray-500 mr-2" />
          <span className="text-gray-700">{job.company}</span>
        </div>
        <div className="flex items-center mb-4">
          <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
          <span className="text-gray-700">{job.location}</span>
        </div>
        <div className="flex items-center mb-6">
          <CurrencyYenIcon className="h-5 w-5 text-gray-500 mr-2" />
          <span className="text-gray-700">{job.salary}</span>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{job.description}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Requirements</h2>
          <ul className="list-disc list-inside text-gray-700">
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
