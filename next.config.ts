import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
  // Remove serverActions.allowedOrigins — Vercel gerencia automaticamente pelo domínio do deploy.
  // Em dev local, Next.js aceita localhost por padrão.
}

export default nextConfig
