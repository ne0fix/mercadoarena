import type { Server as SocketServer } from 'socket.io'

export function getIO(): SocketServer | null {
  return ((globalThis as unknown as Record<string, unknown>).__io as SocketServer) ?? null
}

export function emitToAll(event: string, data: unknown) {
  getIO()?.emit(event, data)
}

export function emitToRoom(room: string, event: string, data: unknown) {
  getIO()?.to(room).emit(event, data)
}
