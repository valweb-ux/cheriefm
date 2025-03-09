/** @type {import('next').NextConfig} */
const nextConfig = {
  // Змінено 'hybrid' на 'standalone', оскільки 'hybrid' не підтримується
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;

