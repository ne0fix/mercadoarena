'use client'

import { useEffect, useState } from 'react'
import { CourtCard } from './CourtCard'
import { useSocket } from '@/views/providers/SocketProvider'
import type { Court } from '@/models/entities/Court'

interface Props {
  initialCourts: Court[]
}

export function CourtsLive({ initialCourts }: Props) {
  const [courts, setCourts] = useState<Court[]>(initialCourts)
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    const handleCourtUpdated = (updated: Court) => {
      setCourts((prev) =>
        prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
      )
    }

    socket.on('court:updated', handleCourtUpdated)
    return () => { socket.off('court:updated', handleCourtUpdated) }
  }, [socket])

  // Sincroniza quando a prop muda (ex: navegação entre páginas)
  useEffect(() => {
    setCourts(initialCourts)
  }, [initialCourts])

  if (courts.length === 0) {
    return (
      <div className="p-12 text-center bg-surface-container rounded-3xl border border-outline-variant/30">
        <p className="font-headline text-on-surface-variant font-medium">Nenhuma quadra disponível no momento.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
      {courts.map((court) => (
        <CourtCard key={court.id} court={court} />
      ))}
    </div>
  )
}
