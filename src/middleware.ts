// Middleware roda no Edge Runtime da Vercel.
// Importa apenas auth.config.ts (sem Prisma, sem bcrypt).
import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'

export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth|api/payments/webhook).*)'],
}
