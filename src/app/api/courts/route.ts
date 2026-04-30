import { NextResponse } from 'next/server'
import { PrismaCourtRepository } from '@/infrastructure/repositories/PrismaCourtRepository'

const repo = new PrismaCourtRepository()

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') ?? undefined
    const courts = await repo.findAll({ isActive: true, type })
    return NextResponse.json(courts, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
    })
  } catch (e) {
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}
