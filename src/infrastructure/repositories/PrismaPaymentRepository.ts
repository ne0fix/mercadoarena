import { prisma } from '@/infrastructure/database/prisma'
import type { IPaymentRepository } from '@/repositories/IPaymentRepository'
import type { Payment, PaymentStatus } from '@/models/entities/Payment'

function toEntity(p: any): Payment {
  return {
    ...p,
    amount: Number(p.amount),
    refundAmount: p.refundAmount ? Number(p.refundAmount) : null,
  }
}

export class PrismaPaymentRepository implements IPaymentRepository {
  async findById(id: string): Promise<Payment | null> {
    const p = await prisma.payment.findUnique({ where: { id } })
    return p ? toEntity(p) : null
  }

  async findByBookingId(bookingId: string): Promise<Payment | null> {
    const p = await prisma.payment.findUnique({ where: { bookingId } })
    return p ? toEntity(p) : null
  }

  async create(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const p = await prisma.payment.create({ data: { ...data, method: data.method as any, status: data.status as any } })
    return toEntity(p)
  }

  async update(id: string, data: Partial<Payment>): Promise<Payment> {
    const p = await prisma.payment.update({ where: { id }, data: data as any })
    return toEntity(p)
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<Payment> {
    const p = await prisma.payment.update({ where: { id }, data: { status: status as any } })
    return toEntity(p)
  }
}
