'use server'

import { prisma } from '@/infrastructure/database/prisma'
import bcrypt from 'bcryptjs'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export async function registerAction(
  name: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string,
): Promise<string | null> {
  const parsed = schema.safeParse({ name, email, phone, password, confirmPassword })
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? 'Dados inválidos'
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
  if (existing) {
    return 'Este e-mail já está cadastrado'
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim() || null,
      passwordHash,
      role: 'CLIENT',
      status: 'ACTIVE',
    },
  })

  try {
    await signIn('credentials', { email: email.toLowerCase().trim(), password, redirect: false })
  } catch (error) {
    if (error instanceof AuthError) {
      // Conta criada mas auto-login falhou — manda pro login
      redirect('/login')
    }
    throw error
  }

  redirect('/')
}
