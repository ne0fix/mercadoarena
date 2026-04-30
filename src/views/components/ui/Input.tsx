'use client'

import { cn } from '@/core/utils/helpers'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Input({ label, error, leftIcon, rightIcon, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="font-headline text-[10px] text-on-surface-variant font-bold uppercase ml-1"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className={cn('flex items-center border rounded-xl px-4 py-3 transition-all bg-surface-container-low', error ? 'border-red-400 focus-within:border-red-500' : 'border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary')}>
        {leftIcon && <span className="text-outline mr-3">{leftIcon}</span>}
        <input
          id={inputId}
          className={cn('w-full bg-transparent border-none p-0 focus:ring-0 text-on-surface font-sans text-sm placeholder:text-outline-variant outline-none', className)}
          {...props}
        />
        {rightIcon && <span className="text-outline ml-3">{rightIcon}</span>}
      </div>
      {error && <p className="text-red-500 text-xs ml-1">{error}</p>}
    </div>
  )
}
