/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ESLintエラーを無視
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TypeScriptの型エラーを無視
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
