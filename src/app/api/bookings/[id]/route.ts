import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PrismaBookingRepository } from '@/infrastructure/repositories/PrismaBookingRepository'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })

  const { id } = await params
  const repo = new PrismaBookingRepository()
  const booking = await repo.findById(id)

  if (!booking) return NextResponse.json({ message: 'Não encontrado' }, { status: 404 })

  const isOwner = booking.userId === session.user.id
  const isAdmin = ['MANAGER', 'ADMIN'].includes(session.user.role)
  if (!isOwner && !isAdmin) return NextResponse.json({ message: 'Não autorizado' }, { status: 403 })

  return NextResponse.json(booking)
}
