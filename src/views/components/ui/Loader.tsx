import { cn } from '@/core/utils/helpers'

interface LoaderProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Loader({ className, size = 'md' }: LoaderProps) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 gap-4', className)}>
      <div className={cn('border-4 border-primary/20 border-t-primary rounded-full animate-spin', sizes[size])} />
      <span className="font-headline text-xs text-on-surface-variant font-bold uppercase tracking-widest">
        Carregando...
      </span>
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('bg-surface-container animate-pulse rounded-xl', className)} />
  )
}
