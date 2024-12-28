// job-portal-mvp/frontend/app/api/personality-quiz/questions/route.ts
import { NextRequest, NextResponse } from 'next/server';

/** サンプル質問リスト */
const sampleQuestions = [
  {
    id: 1,
    question: '新しいICO案件を見つけた時、あなたはどうする？',
    options: [
      { key: 'A', text: '怪しいと思いつつもワクワクして全力突っ込み' },
      { key: 'B', text: 'ホワイトペーパーを読むなど徹底的に調べる' },
      { key: 'C', text: 'SNSやコミュニティの反応をまず確認する' },
      { key: 'D', text: 'リスク管理をしながら冷静に投資判断する' },
    ],
  },
  {
    id: 2,
    question: 'ガス代が高騰しているとき、あなたは？',
    options: [
      { key: 'A', text: '高くても仕方ない、今やりたいから即取引！' },
      { key: 'B', text: '下がるまで待つ or 別チェーンを探す' },
      { key: 'C', text: 'みんなが動いてるなら自分も従う' },
      { key: 'D', text: '必要なら払うが、状況を見極める' },
    ],
  },
];

export async function GET(req: NextRequest) {
  // ここではDBは不要、サンプル質問を返すだけ
  return NextResponse.json({ questions: sampleQuestions });
}
