import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AuthRedirectPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const role = (session.user as any).role
  if (role === 'ADMIN' || role === 'MANAGER') {
    redirect('/admin/dashboard')
  }

  redirect('/')
}
