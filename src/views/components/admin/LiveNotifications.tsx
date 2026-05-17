'use client'

import { useEffect, useState } from 'react'
import { useSocket } from '@/views/providers/SocketProvider'
import { Bell, X, CalendarCheck } from 'lucide-react'

interface Notification {
  id: string
  message: string
  at: Date
}

export function LiveNotifications() {
  const { socket } = useSocket()
  const [notes, setNotes] = useState<Notification[]>([])

  useEffect(() => {
    if (!socket) return

    const handleBookingNew = (data: { courtId: string; date: string; startTime: string; userName: string }) => {
      const note: Notification = {
        id: Math.random().toString(36).slice(2),
        message: `Novo agendamento de ${data.userName ?? 'cliente'} — ${data.startTime} em ${new Date(data.date + 'T00:00:00').toLocaleDateString('pt-BR')}`,
        at: new Date(),
      }
      setNotes((prev) => [note, ...prev].slice(0, 5))
      setTimeout(() => {
        setNotes((prev) => prev.filter((n) => n.id !== note.id))
      }, 8000)
    }

    socket.on('booking:new', handleBookingNew)
    return () => { socket.off('booking:new', handleBookingNew) }
  }, [socket])

  if (notes.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-2 max-w-sm">
      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-surface-container-lowest border border-primary/20 rounded-2xl p-4 shadow-xl flex items-start gap-3 animate-in slide-in-from-right-4 duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <CalendarCheck className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-headline text-xs font-bold text-on-surface flex items-center gap-1.5">
              <Bell className="w-3 h-3 text-primary" /> Agendamento
            </p>
            <p className="font-headline text-[11px] text-on-surface-variant mt-0.5 leading-snug">{note.message}</p>
          </div>
          <button
            onClick={() => setNotes((prev) => prev.filter((n) => n.id !== note.id))}
            className="p-1 hover:bg-surface-container rounded-full transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5 text-on-surface-variant" />
          </button>
        </div>
      ))}
    </div>
  )
}
