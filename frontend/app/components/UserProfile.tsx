"use client";

import React, { useState } from 'react';
import { getApiUrl } from "@/lib/config";

export default function UserProfile() {
  const [formData, setFormData] = useState({ name: '', email: '', resume: null });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const uploadData = new FormData();
    uploadData.append('name', formData.name);
    uploadData.append('email', formData.email);
    if (formData.resume) {
      uploadData.append('resume', formData.resume);
    }

    try {
      const response = await fetch(getApiUrl('upload-resume'), {
        method: 'POST',
        body: uploadData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload resume');
      }

      setMessage('履歴書がアップロードされました！ 🎉');
      console.log('Upload result:', result);
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      setMessage('アップロードに失敗しました。');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">ユーザー情報</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="名前"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
          value={formData.name}
        />
        <input
          type="email"
          name="email"
          placeholder="メール"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
          value={formData.email}
        />
        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          アップロード
        </button>
      </form>
      {message && <p className="mt-2 text-center font-semibold">{message}</p>}
    </div>
  );
}
