// job-portal-mvp/frontend/app/lib/models/QuizResult.ts
import mongoose, { Schema, Model } from 'mongoose';

interface IQuizResult {
  userId: string;
  typeKey: string;
  createdAt?: Date;
}

const QuizResultSchema = new Schema<IQuizResult>({
  userId: { type: String, required: true },
  typeKey: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// すでに存在する場合は再利用、なければモデルを作る
export const QuizResult: Model<IQuizResult> =
  mongoose.models.QuizResult || mongoose.model('QuizResult', QuizResultSchema);
