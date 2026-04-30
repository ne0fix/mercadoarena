'use client'

import { Bell, LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function TopBar() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2 md:gap-4">
      <button className="relative p-2 hover:bg-surface-container rounded-full transition-colors hidden md:block">
        <Bell className="w-5 h-5 text-on-surface-variant" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>
      
      <div className="flex items-center gap-3 pr-2 border-r border-outline-variant/30 hidden md:flex">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="font-headline text-white text-xs font-bold">
            {session?.user?.name?.[0]?.toUpperCase() ?? 'A'}
          </span>
        </div>
        <div className="text-left">
          <p className="font-headline text-sm text-on-surface font-bold leading-tight truncate max-w-[100px]">
            {session?.user?.name ?? 'Admin'}
          </p>
          <p className="font-headline text-[10px] text-on-surface-variant uppercase tracking-tighter">
            {session?.user?.role}
          </p>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        className="p-2 md:p-2.5 hover:bg-red-50 rounded-full transition-colors text-red-600"
        title="Sair do Sistema"
      >
        <LogOut className="w-6 h-6 md:w-8 md:h-8" />
      </button>

    </div>
  )
}
