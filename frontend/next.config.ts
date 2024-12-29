import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ESLintエラーを無視
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TypeScriptの型エラーを無視
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
