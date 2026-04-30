import { cn } from '@/core/utils/helpers'
import type { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  delta?: string
  deltaPositive?: boolean
  icon: ReactNode
  color?: 'primary' | 'success' | 'warning' | 'danger'
}

const colors = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
}

export function StatsCard({ title, value, delta, deltaPositive, icon, color = 'primary' }: StatsCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 sun-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-3 rounded-xl', colors[color])}>{icon}</div>
        {delta && (
          <span className={cn('font-headline text-xs font-bold', deltaPositive ? 'text-green-600' : 'text-red-600')}>
            {deltaPositive ? '↑' : '↓'} {delta}
          </span>
        )}
      </div>
      <p className="font-headline text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1">
        {title}
      </p>
      <p className="font-headline text-2xl text-on-surface font-black">{value}</p>
    </div>
  )
}
