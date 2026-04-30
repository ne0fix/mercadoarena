import { cn } from '@/core/utils/helpers'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  shadow?: boolean
}

export function Card({ children, className, shadow = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden',
        shadow && 'sun-shadow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
