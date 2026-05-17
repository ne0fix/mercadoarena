'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

export async function loginAction(email: string, password: string): Promise<string | null> {
  try {
    await signIn('credentials', { email, password, redirect: false })
  } catch (error) {
    if (error instanceof AuthError) {
      return 'E-mail ou senha incorretos.'
    }
    throw error
  }
  redirect('/auth/redirect')
}
