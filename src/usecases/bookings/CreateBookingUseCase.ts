import type { IBookingRepository } from '@/repositories/IBookingRepository'
import type { ICourtRepository } from '@/repositories/ICourtRepository'
import type { IPaymentRepository } from '@/repositories/IPaymentRepository'
import type { Booking } from '@/models/entities/Booking'
import type { Payment, PaymentMethod } from '@/models/entities/Payment'
import { BookingError } from '@/core/errors/AppError'
import { generateAccessCode, calculateDuration, getEndTime } from '@/core/utils/helpers'
import { mercadoPagoService } from '@/services/MercadoPagoService'

export interface CreateBookingInput {
  userId: string
  userEmail: string
  courtId: string
  date: string
  startTime: string
  paymentMethod: PaymentMethod
  paymentToken?: string
}

export interface CreateBookingOutput {
  booking: Booking
  payment: Payment
  pixQrCode?: string
  pixQrCodeBase64?: string
}

export class CreateBookingUseCase {
  constructor(
    private bookingRepo: IBookingRepository,
    private courtRepo: ICourtRepository,
    private paymentRepo: IPaymentRepository
  ) {}

  async execute(input: CreateBookingInput): Promise<CreateBookingOutput> {
    const court = await this.courtRepo.findById(input.courtId)
    if (!court || !court.isActive) throw new BookingError('COURT_NOT_FOUND')

    const endTime = getEndTime(input.startTime, court.slotDuration)
    const duration = calculateDuration(input.startTime, endTime)

    const isAvailable = await this.bookingRepo.checkAvailability(
      input.courtId,
      input.date,
      input.startTime,
      endTime
    )
    if (!isAvailable) throw new BookingError('SLOT_NOT_AVAILABLE')

    const totalValue = Number(court.pricePerHour) * duration

    const booking = await this.bookingRepo.create({
      userId: input.userId,
      courtId: input.courtId,
      date: new Date(input.date + 'T00:00:00'),
      startTime: input.startTime,
      endTime,
      durationHours: duration,
      totalValue,
      status: 'PENDING',
      accessCode: generateAccessCode(),
      notes: null,
      cancelledAt: null,
      cancelReason: null,
      cancelledBy: null,
    })

    let gatewayId = null
    let gatewayStatus = 'PENDING'
    let pixQrCode = null
    let pixQrCodeBase64 = null
    let pixExpiration = null

    try {
      const mpOrder = await mercadoPagoService.createOrder({
        external_reference: booking.id,
        total_amount: totalValue,
        payer_email: input.userEmail,
        payment_method_id: input.paymentMethod === 'PIX' ? 'pix' : 'visa', // Simplificado para exemplo, visa como fallback
        token: input.paymentToken,
      })

      gatewayId = mpOrder.id ?? null
      gatewayStatus = mpOrder.status ?? 'PENDING'

      if (input.paymentMethod === 'PIX') {
        const paymentData = (mpOrder as any).transactions?.payments?.[0]
        const transactionData = paymentData?.point_of_interaction?.transaction_data
        pixQrCode = transactionData?.qr_code ?? null
        pixQrCodeBase64 = transactionData?.qr_code_base64 ?? null
        pixExpiration = paymentData?.date_of_expiration ? new Date(paymentData.date_of_expiration) : null
      }
    } catch (error) {
      console.error('Failed to create MercadoPago order:', error)
      throw error
    }

    const payment = await this.paymentRepo.create({
      bookingId: booking.id,
      method: input.paymentMethod,
      status: gatewayStatus === 'approved' ? 'APPROVED' : 'PENDING',
      amount: totalValue,
      gatewayId: gatewayId?.toString() || null,
      gatewayStatus: gatewayStatus,
      pixQrCode,
      pixQrCodeBase64,
      pixExpiration,
      cardLastFour: null, // Pode ser extraído do response se disponível
      cardBrand: null,
      installments: 1,
      paidAt: gatewayStatus === 'approved' ? new Date() : null,
      refundedAt: null,
      refundedBy: null,
      refundAmount: null,
      refundGatewayId: null,
      refundReason: null,
    })

    return { 
      booking, 
      payment, 
      pixQrCode: pixQrCode || undefined,
      pixQrCodeBase64: pixQrCodeBase64 || undefined
    }
  }
}
