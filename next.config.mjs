/** @type {import('next').NextConfig} */
const nextConfig = {
  // Вимикаємо статичну генерацію для сторінок, які використовують cookies
  output: 'hybrid',
  images: {
    domains: ['localhost', 'example.com'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
};

export default nextConfig;

