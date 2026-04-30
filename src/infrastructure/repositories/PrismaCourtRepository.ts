import { prisma } from '@/infrastructure/database/prisma'
import type { ICourtRepository } from '@/repositories/ICourtRepository'
import type { Court, DayAvailability, TimeSlot } from '@/models/entities/Court'
import { addMinutes, format, parse } from 'date-fns'

function toEntity(c: any): Court {
  return {
    ...c,
    pricePerHour: Number(c.pricePerHour),
  }
}

export class PrismaCourtRepository implements ICourtRepository {
  async findAll(filters?: { isActive?: boolean; type?: string }): Promise<Court[]> {
    const courts = await prisma.court.findMany({
      where: {
        isActive: filters?.isActive ?? true,
        type: filters?.type as any,
      },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    })
    return courts.map(toEntity)
  }

  async findById(id: string): Promise<Court | null> {
    const court = await prisma.court.findUnique({ where: { id } })
    return court ? toEntity(court) : null
  }

  async getAvailability(courtId: string, date: string): Promise<DayAvailability> {
    const court = await prisma.court.findUnique({ where: { id: courtId } })
    if (!court) return { date, slots: [] }

    const dateObj = new Date(date + 'T00:00:00')

    const [bookings, unavailabilities] = await Promise.all([
      prisma.booking.findMany({
        where: {
          courtId,
          date: dateObj,
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
        select: { startTime: true, endTime: true },
      }),
      prisma.courtUnavailability.findMany({
        where: { courtId, date: dateObj },
      }),
    ])

    if (unavailabilities.length > 0) {
      return { date, slots: [] }
    }

    const slots: TimeSlot[] = []
    const startBase = parse(court.openTime, 'HH:mm', new Date())
    const endBase = parse(court.closeTime, 'HH:mm', new Date())
    let current = startBase

    while (current < endBase) {
      const time = format(current, 'HH:mm')
      const slotEnd = addMinutes(current, court.slotDuration)
      const slotEndStr = format(slotEnd, 'HH:mm')

      const isBooked = bookings.some(
        (b) => b.startTime === time || (b.startTime < time && b.endTime > time)
      )

      slots.push({ time, available: !isBooked })
      current = slotEnd
    }

    return { date, slots }
  }

  async create(data: Omit<Court, 'id' | 'createdAt' | 'updatedAt'>): Promise<Court> {
    const court = await prisma.court.create({ data: { ...data, type: data.type as any } })
    return toEntity(court)
  }

  async update(id: string, data: Partial<Court>): Promise<Court> {
    const court = await prisma.court.update({ where: { id }, data: data as any })
    return toEntity(court)
  }

  async delete(id: string): Promise<void> {
    await prisma.court.update({ where: { id }, data: { isActive: false } })
  }
}
