// job-portal-mvp/frontend/app/personality-quiz/questions/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type Question = {
  id: number;
  question: string;
  options: { key: string; text: string }[];
};

export default function QuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  // { [questionId]: 'A'|'B'|'C'|'D' }
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await axios.get('/api/personality-quiz/questions');
      setQuestions(res.data.questions);
    };
    fetchQuestions();
  }, []);

  const handleOptionChange = (questionId: number, optionKey: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const handleSubmit = async () => {
    // 本来はログインユーザーIDを取得したり、あるいはサインアップ導線を挟む。
    // ここでは仮で "dummy-user"。
    const userId = 'dummy-user';

    // answersオブジェクトを配列に変換
    // 例: {1:'A',2:'B'} -> [{ questionId:1, selectedOption:'A' }, { questionId:2, selectedOption:'B' }]
    const answersArray = Object.entries(answers).map(([qId, opt]) => ({
      questionId: Number(qId),
      selectedOption: opt,
    }));

    const res = await axios.post('/api/personality-quiz/submit', {
      userId,
      answers: answersArray,
    });

    // 結果をクエリに載せてページ遷移
    const typeKey = res.data.result.typeKey;
    router.push(`/personality-quiz/results?typeKey=${typeKey}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>クイズに答える</h2>
      {questions.map((q) => (
        <div key={q.id} style={{ marginBottom: 20 }}>
          <p>{q.question}</p>
          {q.options.map((opt) => (
            <label
              key={opt.key}
              style={{ display: 'block', marginLeft: 20, cursor: 'pointer' }}
            >
              <input
                type="radio"
                name={`q-${q.id}`}
                value={opt.key}
                checked={answers[q.id] === opt.key}
                onChange={() => handleOptionChange(q.id, opt.key)}
              />
              {opt.text}
            </label>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit} style={{ marginTop: 20 }}>
        結果を見る
      </button>
    </div>
  );
}
