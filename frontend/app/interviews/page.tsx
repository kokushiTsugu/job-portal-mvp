"use client";

import React, { useEffect, useState } from "react";
import InterviewCard from "../components/InterviewCard";
import { getApiUrl } from "@/lib/config";

interface Interview {
  _id: string;
  title: string;
  // Add other interview properties as needed
}

export default function InterviewListPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch(getApiUrl("interviews"));
        if (!response.ok) throw new Error("インタビュー一覧の取得に失敗");
        const data = await response.json();
        setInterviews(data.interviews);
      } catch (err) {
        setMessage("インタビュー取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  if (loading) return <div className="text-center py-10">読み込み中...</div>;
  if (message) return <div className="text-center py-10 text-red-500">{message}</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10 text-center">インタビュー一覧</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {interviews.map((interview) => (
          <InterviewCard key={interview._id} interview={interview} />
        ))}
      </div>
    </div>
  );
}
