// job-portal-mvp/frontend/app/personality-quiz/results/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

type PersonalityResult = {
  typeKey: string;
  displayName: string;
  description: string;
};

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<PersonalityResult | null>(null);

  const typeKey = searchParams.get('typeKey');

  // この例ではサーバーに再問い合わせはせず、クエリからタイプキーだけを表示。
  // もし詳細をDBから取り直したければ、別APIを用意して fetch すれば良い。
  useEffect(() => {
    if (!typeKey) return;
    // 仮で画面表示用に作成
    setResult({
      typeKey,
      displayName: typeKey + ' (仮の表示名)',
      description: 'ここで本来はAPIや静的データから詳細情報を取得して表示します。',
    });
  }, [typeKey]);

  if (!typeKey) {
    return <div>診断結果が見つかりません。</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>診断結果</h2>
      {result && (
        <>
          <h3>{result.displayName}</h3>
          <p>タイプキー: {result.typeKey}</p>
          <p>{result.description}</p>
        </>
      )}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => alert('SNSで共有！')}>SNSで共有する</button>
      </div>
    </div>
  );
}
