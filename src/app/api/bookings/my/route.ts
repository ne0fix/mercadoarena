import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PrismaBookingRepository } from '@/infrastructure/repositories/PrismaBookingRepository'

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const repo = new PrismaBookingRepository()
  const result = await repo.findByUser(session.user.id, {
    page: Number(searchParams.get('page') ?? 1),
    limit: Number(searchParams.get('limit') ?? 50),
  })

  return NextResponse.json(result)
}
