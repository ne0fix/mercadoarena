import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PrismaCourtRepository } from '@/infrastructure/repositories/PrismaCourtRepository'

export async function GET() {
  const session = await auth()
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const repo = new PrismaCourtRepository()
  const courts = await repo.findAll({ isActive: undefined })
  return NextResponse.json(courts)
}
