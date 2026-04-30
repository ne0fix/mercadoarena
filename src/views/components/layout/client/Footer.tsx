'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, User, MessageCircle } from 'lucide-react'
import { cn } from '@/core/utils/helpers'
import { ROUTES } from '@/core/constants/config'

const items = [
  { icon: Home, label: 'Início', path: ROUTES.HOME },
  { icon: Calendar, label: 'Reservas', path: ROUTES.BOOKINGS },
  { icon: User, label: 'Perfil', path: ROUTES.PROFILE },
  { icon: MessageCircle, label: 'Suporte', path: ROUTES.CONTACT },
]

export function Footer() {
  const pathname = usePathname()

  return (
    <footer className="hidden md:flex bg-surface-container border-t border-outline-variant/30 justify-between items-center px-4 md:px-8 py-6 mt-auto">
      <div className="flex flex-col gap-1">
        <p className="font-headline text-sm font-bold text-primary">Arena Beach Serra</p>
        <p className="text-[10px] text-on-surface-variant font-medium">© 2026 Todos os direitos reservados.</p>
      </div>
      
      <div className="flex items-center gap-6">
        {items.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex flex-col items-center gap-1 px-2 py-1 transition-all hover:scale-105',
                isActive ? 'text-primary' : 'text-outline hover:text-primary'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-headline text-[10px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </footer>
  )
}
