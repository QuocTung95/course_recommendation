/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Tắt Strict Mode
  swcMinify: true,
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
