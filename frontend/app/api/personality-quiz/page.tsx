// job-portal-mvp/frontend/app/personality-quiz/page.tsx
'use client';

import Link from 'next/link';

export default function PersonalityQuizTopPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Web3版 16Personalities 診断</h1>
      <p>
        あなたのWeb3でのキャラクタータイプは？  
        数問の質問に答えて、自分の「Web3パーソナリティ」を診断してみましょう。
      </p>
      <Link href="/personality-quiz/questions">
        <button>はじめる</button>
      </Link>
    </div>
  );
}
