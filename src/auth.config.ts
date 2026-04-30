import type { NextAuthConfig } from 'next-auth'

// Configuração Edge-safe: sem Prisma, sem bcrypt.
// Usada pelo middleware (Edge Runtime).
// A autenticação completa (com DB) fica em auth.ts.
export const authConfig: NextAuthConfig = {
  providers: [],
  trustHost: true, // necessário para Vercel (HTTPS em domínios *.vercel.app)
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute =
        nextUrl.pathname.startsWith('/admin') ||
        nextUrl.pathname.startsWith('/api/admin')
      const protectedClient = ['/bookings', '/profile', '/payment', '/booking-success', '/booking-error']
      const isProtectedClient = protectedClient.some((p) => nextUrl.pathname.startsWith(p))

      if (isAdminRoute) {
        if (!isLoggedIn) return Response.redirect(new URL('/login', nextUrl))
        const role = (auth?.user as any)?.role
        if (role !== 'MANAGER' && role !== 'ADMIN') return Response.redirect(new URL('/', nextUrl))
      }

      if (isProtectedClient && !isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl))
      }

      return true
    },
  },
  session: { strategy: 'jwt' },
}
