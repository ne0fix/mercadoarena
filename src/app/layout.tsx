import type { Metadata } from 'next'
import { Lexend, Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/views/providers/QueryProvider'
import { SessionProvider } from '@/views/providers/SessionProvider'
import { auth } from '@/auth'

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-headline',
})

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Arena Beach Serra',
  description: 'Agende sua quadra de beach sports com facilidade.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="pt-BR" className={`${lexend.variable} ${beVietnamPro.variable}`}>
      <body className="antialiased">
        <SessionProvider session={session}>
          <QueryProvider>{children}</QueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
