// auth.ts roda no Node.js Runtime (Server Components, Route Handlers).
// Nunca importado pelo middleware — que usa auth.config.ts (Edge-safe).
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/infrastructure/database/prisma'
import bcrypt from 'bcryptjs'
import type { UserRole } from '@prisma/client'
import { authConfig } from '@/auth.config'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: UserRole
      image?: string | null
    }
  }
  interface User {
    role: UserRole
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role: UserRole
    id: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  basePath: '/api/auth',
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.passwordHash) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatarUrl,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role as UserRole
        token.id = (user as any).id as string
      }
      return token
    },
    session({ session, token }) {
      ;(session.user as any).role = token.role as UserRole
      ;(session.user as any).id = token.id as string
      return session
    },
  },
})
