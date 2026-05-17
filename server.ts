import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server as SocketServer } from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT ?? '3000', 10)
const hostname = 'localhost'

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res, parse(req.url!, true))
  })

  const io = new SocketServer(httpServer, {
    path: '/api/socketio',
    cors: { origin: '*', methods: ['GET', 'POST'] },
    transports: ['websocket', 'polling'],
  })

  // Expõe globalmente para as API routes emitirem eventos
  ;(globalThis as unknown as Record<string, unknown>).__io = io

  io.on('connection', (socket) => {
    // Admin entra na sala 'admin', clientes entram em 'client'
    socket.on('join:room', (room: 'admin' | 'client') => {
      socket.join(room)
    })

    socket.on('disconnect', () => {})
  })

  httpServer.listen(port, () => {
    console.log(`\n > Arena Beach pronto em http://localhost:${port}\n`)
  })
})
