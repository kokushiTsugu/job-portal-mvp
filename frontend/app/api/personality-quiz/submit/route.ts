// job-portal-mvp/frontend/app/api/personality-quiz/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/app/lib/mongo';
import { QuizResult } from '@/app/lib/models/QuizResult';

/** Personality Types (サンプル16種) */
const personalityTypes = [
  {
    typeKey: 'FOMO_FANATIC',
    displayName: 'The FOMO Fanatic',
    description:
      '「乗り遅れたくない！」と焦って高値掴みが多い。熱中しやすいタイプ。',
  },
  {
    typeKey: 'RUGPULL_SURFER',
    displayName: 'The Rugpull Surfer',
    description:
      '怪しい新規トークンにも果敢に飛び込み、よく爆損する。リスク愛好家。',
  },
  // ・・・中略（実際には16種類すべてを載せる）・・・
  {
    typeKey: 'ONCHAIN_ORACLE',
    displayName: 'The On-chain Oracle',
    description:
      'オンチェーンデータを読み解き、プロジェクトの真価を見極める賢者的存在。',
  },
  {
    typeKey: 'DAO_DIPLOMAT',
    displayName: 'The DAO Diplomat',
    description:
      '複数のDAOをまたぎながら投票や議論をまとめるコミュニティリーダー。',
  },
];

/**
 * [POST] /api/personality-quiz/submit
 * リクエストBody: { userId: string, answers: { questionId: number, selectedOption: 'A'|'B'|'C'|'D' }[] }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, answers } = body;

    // ここで本当はJWTなどで認証済みの userId を使うのが理想ですが、
    // サンプルなので生 userId を受け取る形にしてます。

    // ざっくりなスコアリング例
    let scoreA = 0;
    let scoreB = 0;
    let scoreC = 0;
    let scoreD = 0;

    answers.forEach((ans: any) => {
      if (ans.selectedOption === 'A') scoreA++;
      if (ans.selectedOption === 'B') scoreB++;
      if (ans.selectedOption === 'C') scoreC++;
      if (ans.selectedOption === 'D') scoreD++;
    });

    const maxScore = Math.max(scoreA, scoreB, scoreC, scoreD);
    let determinedType = 'RUGPULL_SURFER'; // デフォルト
    switch (true) {
      case scoreA === maxScore:
        determinedType = 'FOMO_FANATIC';
        break;
      case scoreB === maxScore:
        determinedType = 'ONCHAIN_ORACLE';
        break;
      case scoreC === maxScore:
        determinedType = 'MEME_MAVEN';
        break;
      case scoreD === maxScore:
        determinedType = 'DAO_DIPLOMAT';
        break;
      default:
        determinedType = 'RUGPULL_SURFER';
    }

    // personalityTypesから検索
    const foundType = personalityTypes.find(
      (t) => t.typeKey === determinedType
    ) || {
      typeKey: 'RUGPULL_SURFER',
      displayName: 'The Rugpull Surfer',
      description: 'ダミー',
    };

    // DB接続 & 保存
    await connectToDB();
    const created = await QuizResult.create({
      userId,
      typeKey: foundType.typeKey,
      createdAt: new Date(),
    });

    return NextResponse.json({
      result: {
        typeKey: foundType.typeKey,
        displayName: foundType.displayName,
        description: foundType.description,
      },
      savedId: created._id,
    });
  } catch (error) {
    console.error('Error in POST /submit:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
