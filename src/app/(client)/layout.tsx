import { ClientLayout } from '@/views/components/layout/client/ClientLayout'
import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>
}
