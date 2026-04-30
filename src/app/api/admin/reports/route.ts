import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/infrastructure/database/prisma'
import { format } from 'date-fns'
import { formatCurrency } from '@/core/utils/formatCurrency'

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user || !['MANAGER', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const startDate = searchParams.get('startDate') ?? format(new Date(), 'yyyy-MM-01')
  const endDate = searchParams.get('endDate') ?? format(new Date(), 'yyyy-MM-dd')
  const courtId = searchParams.get('courtId') ?? undefined
  const outputFormat = searchParams.get('format') ?? 'json'

  const bookings = await prisma.booking.findMany({
    where: {
      date: {
        gte: new Date(startDate + 'T00:00:00'),
        lte: new Date(endDate + 'T23:59:59'),
      },
      ...(courtId ? { courtId } : {}),
    },
    include: {
      court: { select: { name: true, location: true } },
      user: { select: { name: true, email: true } },
      payment: { select: { method: true, status: true, amount: true, refundAmount: true } },
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  })

  if (outputFormat === 'csv') {
    const header = 'Data,Quadra,Cliente,Horário,Valor,Status,Pagamento'
    const rows = bookings.map((b) =>
      [
        format(new Date(b.date), 'dd/MM/yyyy'),
        b.court.name,
        b.user.name,
        b.startTime,
        formatCurrency(Number(b.totalValue)),
        b.status,
        b.payment?.method ?? '—',
      ].join(',')
    )
    const csv = [header, ...rows].join('\n')
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="relatorio-${startDate}-${endDate}.csv"`,
      },
    })
  }

  const totalRevenue = bookings
    .filter((b) => b.payment?.status === 'APPROVED')
    .reduce((sum, b) => sum + Number(b.totalValue), 0)

  const refundedAmount = bookings
    .filter((b) => ['REFUNDED', 'PARTIAL_REFUND'].includes(b.payment?.status ?? ''))
    .reduce((sum, b) => sum + Number(b.payment?.refundAmount ?? 0), 0)

  const dayMap: Record<string, { label: string; revenue: number; refunds: number }> = {}
  bookings.forEach((b) => {
    const d = format(new Date(b.date), 'dd/MM')
    if (!dayMap[d]) dayMap[d] = { label: d, revenue: 0, refunds: 0 }
    if (b.payment?.status === 'APPROVED') dayMap[d].revenue += Number(b.totalValue)
    if (['REFUNDED', 'PARTIAL_REFUND'].includes(b.payment?.status ?? '')) {
      dayMap[d].refunds += Number(b.payment?.refundAmount ?? 0)
    }
  })

  return NextResponse.json({
    bookings,
    summary: {
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status === 'CONFIRMED').length,
      cancelled: bookings.filter((b) => b.status === 'CANCELLED').length,
      totalRevenue,
      refundedAmount,
      netRevenue: totalRevenue - refundedAmount,
    },
    chartData: Object.values(dayMap),
  })
}
