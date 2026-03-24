/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', 'siteforgeai-production.up.railway.app'],
    },
  },
}

module.exports = nextConfig
