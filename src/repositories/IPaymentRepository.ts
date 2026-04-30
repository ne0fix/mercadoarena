import type { Payment, PaymentStatus } from '@/models/entities/Payment'

export interface IPaymentRepository {
  findById(id: string): Promise<Payment | null>
  findByBookingId(bookingId: string): Promise<Payment | null>
  create(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment>
  update(id: string, data: Partial<Payment>): Promise<Payment>
  updateStatus(id: string, status: PaymentStatus): Promise<Payment>
}
