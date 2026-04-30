import { NextResponse } from 'next/server'
import { PrismaCourtRepository } from '@/infrastructure/repositories/PrismaCourtRepository'
import { z } from 'zod'

const repo = new PrismaCourtRepository()

const schema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) })

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { searchParams } = new URL(req.url)
  const result = schema.safeParse({ date: searchParams.get('date') })

  if (!result.success) {
    return NextResponse.json({ message: 'Data inválida (use YYYY-MM-DD)' }, { status: 400 })
  }

  const availability = await repo.getAvailability(id, result.data.date)
  return NextResponse.json(availability)
}
