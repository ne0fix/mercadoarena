export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD'
export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PARTIAL_REFUND'
  | 'EXPIRED'

export interface Payment {
  id: string
  bookingId: string
  method: PaymentMethod
  status: PaymentStatus
  amount: number
  gatewayId: string | null
  gatewayStatus: string | null
  pixQrCode: string | null
  pixQrCodeBase64: string | null
  pixExpiration: Date | null
  cardLastFour: string | null
  cardBrand: string | null
  installments: number
  paidAt: Date | null
  refundedAt: Date | null
  refundedBy: string | null
  refundAmount: number | null
  refundGatewayId: string | null
  refundReason: string | null
  createdAt: Date
  updatedAt: Date
}
