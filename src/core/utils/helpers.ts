import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateAccessCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const prefix = Array.from({ length: 2 }, () => letters[Math.floor(Math.random() * letters.length)]).join('')
  const part1 = Math.floor(1000 + Math.random() * 9000)
  const part2 = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${part1}-${part2}`
}

export function calculateDuration(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  return (eh * 60 + em - (sh * 60 + sm)) / 60
}

export function getEndTime(startTime: string, durationMinutes = 60): string {
  const [h, m] = startTime.split(':').map(Number)
  const total = h * 60 + m + durationMinutes
  const endH = Math.floor(total / 60)
  const endM = total % 60
  return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`
}
