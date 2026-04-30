import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatDate(date: Date | string, pattern = "dd 'de' MMM, yyyy"): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, pattern, { locale: ptBR })
}

export function formatDateShort(date: Date | string): string {
  return formatDate(date, 'dd/MM/yyyy')
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, "dd/MM/yyyy 'às' HH:mm")
}

export function formatTimeFromDate(date: Date | string): string {
  return formatDate(date, 'HH:mm')
}
