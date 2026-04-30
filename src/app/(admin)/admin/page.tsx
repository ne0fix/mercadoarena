import { redirect } from 'next/navigation'
import { ROUTES } from '@/core/constants/config'

export default function AdminPage() {
  redirect(ROUTES.ADMIN.DASHBOARD)
}
