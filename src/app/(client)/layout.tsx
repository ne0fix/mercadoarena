import { ClientLayout } from '@/views/components/layout/client/ClientLayout'
import { SocketProvider } from '@/views/providers/SocketProvider'
import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SocketProvider room="client">
      <ClientLayout>{children}</ClientLayout>
    </SocketProvider>
  )
}
