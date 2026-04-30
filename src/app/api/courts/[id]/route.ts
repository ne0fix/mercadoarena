import { NextResponse } from 'next/server'
import { PrismaCourtRepository } from '@/infrastructure/repositories/PrismaCourtRepository'
import { auth } from '@/auth'

const repo = new PrismaCourtRepository()

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const court = await repo.findById(id)
  if (!court) return NextResponse.json({ message: 'Quadra não encontrada' }, { status: 404 })
  return NextResponse.json(court)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !['MANAGER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json()
  const updated = await repo.update(id, body)
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 403 })
  }
  const { id } = await params
  await repo.delete(id)
  return NextResponse.json({ success: true })
}
