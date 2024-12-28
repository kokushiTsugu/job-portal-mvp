// job-portal-mvp/frontend/app/lib/mongo.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

/**
 * Next.jsのサーバーレイヤーでMongooseを使う際の接続ヘルパー。
 * 同じ接続が複数回初期化されるのを防ぐためにcacheを利用。
 */
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in .env');
}

let cached = global.mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  if (cached.conn) {
    // すでに接続済み
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
