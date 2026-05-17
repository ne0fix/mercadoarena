'use client'

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import { type Socket } from 'socket.io-client'
import { getSocket } from '@/lib/socket-client'

interface SocketContextValue {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextValue>({ socket: null })

export function useSocket() {
  return useContext(SocketContext)
}

interface Props {
  children: ReactNode
  room: 'admin' | 'client'
}

export function SocketProvider({ children, room }: Props) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = getSocket()
    socketRef.current = socket

    const handleConnect = () => {
      socket.emit('join:room', room)
    }

    if (socket.connected) {
      socket.emit('join:room', room)
    } else {
      socket.on('connect', handleConnect)
    }

    return () => {
      socket.off('connect', handleConnect)
    }
  }, [room])

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  )
}
